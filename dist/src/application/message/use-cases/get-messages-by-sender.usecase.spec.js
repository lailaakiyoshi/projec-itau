"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_messages_by_sender_usecase_1 = require("./get-messages-by-sender.usecase");
describe('GetMessagesBySenderUseCase', () => {
    it('should call repository.findBySender', async () => {
        const repo = {
            findBySender: jest.fn().mockResolvedValue([]),
        };
        const useCase = new get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase(repo);
        await useCase.execute('laila');
        expect(repo.findBySender).toHaveBeenCalledWith('laila');
    });
});
//# sourceMappingURL=get-messages-by-sender.usecase.spec.js.map