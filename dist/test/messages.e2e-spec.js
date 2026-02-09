"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
describe('Messages API (e2e)', () => {
    let app;
    let token;
    let createdMessageId;
    beforeAll(async () => {
        process.env.AUTH_USERNAME = 'admin';
        process.env.AUTH_PASSWORD = 'admin';
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-e2e';
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
    it('should login and get token', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({
            username: 'admin',
            password: 'admin',
        })
            .expect(201);
        expect(response.body.access_token).toBeDefined();
        token = response.body.access_token;
    });
    it('should create a message', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({
            content: 'Teste E2E',
            sender: 'Laila',
        })
            .expect(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.sender).toBe('Laila');
        expect(response.body.status).toBe('SENT');
        createdMessageId = response.body.id;
    });
    it('should get a message by id', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/messages/${createdMessageId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body.id).toBe(createdMessageId);
        expect(response.body.content).toBe('Teste E2E');
        expect(response.body.sender).toBe('Laila');
    });
    it('should update message status (case-insensitive input) respecting transitions', async () => {
        const response1 = await (0, supertest_1.default)(app.getHttpServer())
            .patch(`/messages/${createdMessageId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'received' })
            .expect(200);
        expect(response1.body.status).toBe('RECEIVED');
        const response2 = await (0, supertest_1.default)(app.getHttpServer())
            .patch(`/messages/${createdMessageId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'read' })
            .expect(200);
        expect(response2.body.status).toBe('READ');
    });
    it('should get messages by sender ignoring case', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get('/messages')
            .query({ sender: 'lAiLa' })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        const ids = response.body.map((m) => m.id);
        expect(ids).toContain(createdMessageId);
    });
    it('should get messages by period (YYYY-MM-DD)', async () => {
        const today = new Date();
        const yyyy = today.getUTCFullYear();
        const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(today.getUTCDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get('/messages')
            .query({
            startDate: dateStr,
            endDate: dateStr,
        })
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        const ids = response.body.map((m) => m.id);
        expect(ids).toContain(createdMessageId);
    });
});
//# sourceMappingURL=messages.e2e-spec.js.map