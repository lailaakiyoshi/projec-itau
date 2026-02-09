"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
function isoYyyyMmDdUTC(date = new Date()) {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
describe('Messages API (e2e)', () => {
    let app;
    let token;
    let tokenShortLived;
    let createdMessageId;
    beforeAll(async () => {
        process.env.AUTH_USERNAME = 'admin';
        process.env.AUTH_PASSWORD = 'admin';
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-e2e';
        process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600';
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Auth', () => {
        it('should login and get token', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' })
                .expect((r) => {
                if (![200, 201].includes(r.status)) {
                    throw new Error(`Expected 200/201, got ${r.status}`);
                }
            });
            expect(res.body.access_token).toBeDefined();
            token = res.body.access_token;
        });
        it('should fail login with invalid credentials', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'admin', password: 'wrong' })
                .expect(401);
            expect(res.body).toBeDefined();
        });
        it('should fail login when body is invalid (missing fields)', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({ username: 'admin' })
                .expect(400);
            expect(res.body).toBeDefined();
        });
    });
    describe('Authorization (JWT Guard)', () => {
        it('should return 401 when calling protected route without token', async () => {
            await (0, supertest_1.default)(app.getHttpServer()).get('/messages').expect(401);
        });
        it('should return 401 when calling protected route with invalid token', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .set('Authorization', `Bearer invalid.token.here`)
                .expect(401);
        });
    });
    describe('Messages - Happy Path', () => {
        it('should create a message', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/messages')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Teste E2E', sender: 'Laila' })
                .expect(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.sender).toBe('Laila');
            expect(res.body.status).toBe('SENT');
            createdMessageId = res.body.id;
        });
        it('should get a message by id', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/messages/${createdMessageId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(res.body.id).toBe(createdMessageId);
            expect(res.body.content).toBe('Teste E2E');
            expect(res.body.sender).toBe('Laila');
        });
        it('should update message status (case-insensitive) respecting transitions', async () => {
            const r1 = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/messages/${createdMessageId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'received' })
                .expect(200);
            expect(r1.body.status).toBe('RECEIVED');
            const r2 = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/messages/${createdMessageId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'read' })
                .expect(200);
            expect(r2.body.status).toBe('READ');
        });
        it('should get messages by sender ignoring case', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .query({ sender: 'lAiLa' })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            const ids = res.body.map((m) => m.id);
            expect(ids).toContain(createdMessageId);
        });
        it('should get messages by period (YYYY-MM-DD)', async () => {
            const dateStr = isoYyyyMmDdUTC(new Date());
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .query({ startDate: dateStr, endDate: dateStr })
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
            expect(Array.isArray(res.body)).toBe(true);
            const ids = res.body.map((m) => m.id);
            expect(ids).toContain(createdMessageId);
        });
    });
    describe('Messages - Validation & Errors', () => {
        it('should return 400 when creating message with invalid body (missing sender)', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/messages')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Teste E2E' })
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 when get by id uses invalid uuid', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages/not-a-uuid')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 404 when message id does not exist', async () => {
            const nonExistingUuid = '00000000-0000-4000-8000-000000000000';
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/messages/${nonExistingUuid}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
            expect(res.body).toBeDefined();
        });
        it('should return 400 for GET /messages when no sender and no period provided', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 when only startDate is provided', async () => {
            const dateStr = isoYyyyMmDdUTC(new Date());
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .query({ startDate: dateStr })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 when startDate is invalid', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .query({ startDate: 'not-a-date', endDate: '2026-02-01' })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 when startDate > endDate', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/messages')
                .query({ startDate: '2026-02-10', endDate: '2026-02-01' })
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 400 when updating status with invalid body', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/messages/${createdMessageId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: '' })
                .expect(400);
            expect(res.body).toBeDefined();
        });
        it('should return 404 when updating status for non-existing message', async () => {
            const nonExistingUuid = '00000000-0000-4000-8000-000000000000';
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/messages/${nonExistingUuid}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'RECEIVED' })
                .expect(404);
            expect(res.body).toBeDefined();
        });
        it('should return 400 (or 409) when status transition is invalid (depends on your rules)', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .patch(`/messages/${createdMessageId}/status`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'SENT' })
                .expect((r) => {
                if (![400, 409].includes(r.status)) {
                    throw new Error(`Expected 400/409, got ${r.status}`);
                }
            });
            expect(res.body).toBeDefined();
        });
    });
    describe('Token expiration (JWT_EXPIRES_IN)', () => {
        it('should return 401 when token is expired', async () => {
            const originalExpires = process.env.JWT_EXPIRES_IN;
            const originalSecret = process.env.JWT_SECRET;
            process.env.JWT_SECRET = originalSecret || 'jwt-secret-e2e';
            process.env.JWT_EXPIRES_IN = '1'; // 1 segundo
            const moduleRef2 = await testing_1.Test.createTestingModule({
                imports: [app_module_1.AppModule],
            }).compile();
            const app2 = moduleRef2.createNestApplication();
            app2.useGlobalPipes(new common_1.ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
            }));
            await app2.init();
            const loginRes = await (0, supertest_1.default)(app2.getHttpServer())
                .post('/auth/login')
                .send({ username: 'admin', password: 'admin' })
                .expect((r) => {
                if (![200, 201].includes(r.status)) {
                    throw new Error(`Expected 200/201, got ${r.status}`);
                }
            });
            const shortToken = loginRes.body.access_token;
            expect(shortToken).toBeDefined();
            await sleep(1200);
            await (0, supertest_1.default)(app2.getHttpServer())
                .get('/messages')
                .query({ sender: 'Laila' })
                .set('Authorization', `Bearer ${shortToken}`)
                .expect(401);
            await app2.close();
            process.env.JWT_EXPIRES_IN = originalExpires;
            process.env.JWT_SECRET = originalSecret;
        });
    });
    it('should return 404 when sender does not exist', async () => {
        const res = await (0, supertest_1.default)(app.getHttpServer())
            .get('/messages')
            .query({ sender: 'SENDER_INEXISTENTE_123' })
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
        expect(res.body).toBeDefined();
        expect(String(res.body.message)).toContain('Sender not found');
    });
});
//# sourceMappingURL=messages.e2e-spec.js.map