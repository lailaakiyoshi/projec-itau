"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const get_messages_by_period_usecase_1 = require("./get-messages-by-period.usecase");
const message_entity_1 = require("../../../domain/message/message.entity");
const message_status_enum_1 = require("../../../domain/message/message-status.enum");
describe('GetMessagesByPeriodUseCase', () => {
    it('should return messages when found', async () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        const repo = {
            findByPeriod: jest.fn().mockResolvedValue([msg]),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        const result = await useCase.execute('2026-02-01', '2026-02-02');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });
    it('should throw NotFoundException when no messages are found for period', async () => {
        const repo = {
            findByPeriod: jest.fn().mockResolvedValue([]),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        await expect(useCase.execute('2026-02-01', '2026-02-02')).rejects.toBeInstanceOf(common_1.NotFoundException);
    });
    it('should throw BadRequestException when startDate is missing', async () => {
        const repo = {
            findByPeriod: jest.fn(),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        await expect(useCase.execute('', '2026-02-02')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.findByPeriod).not.toHaveBeenCalled();
    });
    it('should throw BadRequestException when endDate is missing', async () => {
        const repo = {
            findByPeriod: jest.fn(),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        await expect(useCase.execute('2026-02-01', '')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.findByPeriod).not.toHaveBeenCalled();
    });
    it('should throw BadRequestException when date format is invalid', async () => {
        const repo = {
            findByPeriod: jest.fn(),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        await expect(useCase.execute('2026/02/01', '2026-02-02')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.findByPeriod).not.toHaveBeenCalled();
    });
    it('should throw BadRequestException when startDate > endDate', async () => {
        const repo = {
            findByPeriod: jest.fn(),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        await expect(useCase.execute('2026-02-10', '2026-02-02')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.findByPeriod).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=get-messages-by-period.usecase.spec.js.map