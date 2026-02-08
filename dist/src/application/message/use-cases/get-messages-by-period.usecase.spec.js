"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_messages_by_period_usecase_1 = require("./get-messages-by-period.usecase");
describe('GetMessagesByPeriodUseCase', () => {
    it('should call repository.findByPeriod', async () => {
        const repo = {
            findByPeriod: jest.fn().mockResolvedValue([]),
        };
        const useCase = new get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase(repo);
        const start = new Date('2026-02-01T00:00:00Z');
        const end = new Date('2026-02-28T23:59:59.999Z');
        await useCase.execute(start, end);
        expect(repo.findByPeriod).toHaveBeenCalledWith(start, end);
    });
});
//# sourceMappingURL=get-messages-by-period.usecase.spec.js.map