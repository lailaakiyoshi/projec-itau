"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessagesUseCase = void 0;
class GetMessagesUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(filters) {
        if (filters.sender) {
            return this.repository.findBySender(filters.sender);
        }
        if (filters.startDate && filters.endDate) {
            return this.repository.findByPeriod(filters.startDate, filters.endDate);
        }
        return [];
    }
}
exports.GetMessagesUseCase = GetMessagesUseCase;
//# sourceMappingURL=get-messages-by-filter.usecase.js.map