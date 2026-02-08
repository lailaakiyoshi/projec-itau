"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryMessageRepository = void 0;
const common_1 = require("@nestjs/common");
let InMemoryMessageRepository = class InMemoryMessageRepository {
    constructor() {
        this.messages = new Map();
    }
    async save(message) {
        this.messages.set(message.id, message);
    }
    async findById(id) {
        return this.messages.get(id) ?? null;
    }
    async findBySender(sender) {
        const normalizedSender = sender.trim().toLowerCase();
        return [...this.messages.values()].filter(message => message.sender.toLowerCase() === normalizedSender);
    }
    async findByPeriod(start, end) {
        return [...this.messages.values()].filter(message => message.sentAt >= start && message.sentAt <= end);
    }
    async update(message) {
        this.messages.set(message.id, message);
    }
};
exports.InMemoryMessageRepository = InMemoryMessageRepository;
exports.InMemoryMessageRepository = InMemoryMessageRepository = __decorate([
    (0, common_1.Injectable)()
], InMemoryMessageRepository);
//# sourceMappingURL=in-memory-message.repository.js.map