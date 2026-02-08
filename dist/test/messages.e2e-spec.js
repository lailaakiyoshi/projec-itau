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
    let createdId;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
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
            username: 'laila',
            password: '123',
        });
        expect([200, 201]).toContain(response.status);
        expect(response.body.access_token).toBeTruthy();
        token = response.body.access_token;
    });
    it('should create a message', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({
            content: 'e2e msg',
            sender: 'Laila',
        })
            .expect(201);
        createdId = response.body.id;
        expect(createdId).toBeDefined();
        expect(response.body.status).toBe('SENT');
    });
    it('should get a message by id', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get(`/messages/${createdId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(response.body.id).toBe(createdId);
    });
    it('should update message status (case-insensitive input)', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .patch(`/messages/${createdId}/status`)
            .set('Authorization', `Bearer ${token}`)
            .send({
            status: 'read',
        })
            .expect(200);
        expect(response.body.status).toBe('READ');
    });
    it('should get messages by sender ignoring case', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get('/messages/sender/laila')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
    it('should get messages by period', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get('/messages/period?start=2026-02-01&end=2026-02-28')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });
});
