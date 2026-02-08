"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const update_message_status_usecase_1 = require("./update-message-status.usecase");
const message_entity_1 = require("../../../domain/message/message.entity");
const message_status_enum_1 = require("../../../domain/message/message-status.enum");
describe('UpdateMessageStatusUseCase', () => {
    it('should update status from SENT to RECEIVED and persist', async () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        const repo = {
            findById: jest.fn().mockResolvedValue(msg),
            update: jest.fn().mockResolvedValue(undefined),
        };
        const useCase = new update_message_status_usecase_1.UpdateMessageStatusUseCase(repo);
        const result = await useCase.execute('id', message_status_enum_1.MessageStatus.RECEIVED);
        expect(result.status).toBe(message_status_enum_1.MessageStatus.RECEIVED);
        expect(repo.update).toHaveBeenCalledWith(msg);
    });
    it('should update status from RECEIVED to READ and persist', async () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.RECEIVED);
        const repo = {
            findById: jest.fn().mockResolvedValue(msg),
            update: jest.fn().mockResolvedValue(undefined),
        };
        const useCase = new update_message_status_usecase_1.UpdateMessageStatusUseCase(repo);
        const result = await useCase.execute('id', message_status_enum_1.MessageStatus.READ);
        expect(result.status).toBe(message_status_enum_1.MessageStatus.READ);
        expect(repo.update).toHaveBeenCalledWith(msg);
    });
    it('should throw BadRequestException for invalid status transition (SENT -> READ)', async () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        const repo = {
            findById: jest.fn().mockResolvedValue(msg),
            update: jest.fn(),
        };
        const useCase = new update_message_status_usecase_1.UpdateMessageStatusUseCase(repo);
        await expect(useCase.execute('id', message_status_enum_1.MessageStatus.READ)).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.update).not.toHaveBeenCalled();
    });
    it('should throw NotFoundException if message is not found', async () => {
        const repo = {
            findById: jest.fn().mockResolvedValue(null),
        };
        const useCase = new update_message_status_usecase_1.UpdateMessageStatusUseCase(repo);
        await expect(useCase.execute('x', message_status_enum_1.MessageStatus.READ)).rejects.toBeInstanceOf(common_1.NotFoundException);
    });
});
//# sourceMappingURL=update-message-status.usecase.spec.js.map