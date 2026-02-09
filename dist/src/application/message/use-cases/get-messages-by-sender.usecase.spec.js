"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const get_messages_by_sender_usecase_1 = require("./get-messages-by-sender.usecase");
const message_entity_1 = require("../../../domain/message/message.entity");
const message_status_enum_1 = require("../../../domain/message/message-status.enum");
describe('GetMessagesBySenderUseCase', () => {
    it('should call repository.findBySender and return messages when found', async () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        const repo = {
            findBySender: jest.fn().mockResolvedValue([msg]),
        };
        const useCase = new get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase(repo);
        const result = await useCase.execute('sender');
        expect(repo.findBySender).toHaveBeenCalledTimes(1);
        expect(repo.findBySender).toHaveBeenCalledWith('sender');
        expect(result).toEqual([msg]);
    });
    it('should throw NotFoundException when sender has no messages', async () => {
        const repo = {
            findBySender: jest.fn().mockResolvedValue([]),
        };
        const useCase = new get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase(repo);
        await expect(useCase.execute('sender')).rejects.toBeInstanceOf(common_1.NotFoundException);
        expect(repo.findBySender).toHaveBeenCalledTimes(1);
        expect(repo.findBySender).toHaveBeenCalledWith('sender');
    });
    it('should throw BadRequestException when sender is empty', async () => {
        const repo = {
            findBySender: jest.fn(),
        };
        const useCase = new get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase(repo);
        await expect(useCase.execute('')).rejects.toBeInstanceOf(common_1.BadRequestException);
        expect(repo.findBySender).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=get-messages-by-sender.usecase.spec.js.map