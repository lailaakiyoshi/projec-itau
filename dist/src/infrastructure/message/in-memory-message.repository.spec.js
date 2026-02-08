"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const in_memory_message_repository_1 = require("./in-memory-message.repository");
const message_entity_1 = require("../../domain/message/message.entity");
const message_status_enum_1 = require("../../domain/message/message-status.enum");
describe('InMemoryMessageRepository', () => {
    it('should find by sender ignoring case', async () => {
        const repo = new in_memory_message_repository_1.InMemoryMessageRepository();
        const m1 = new message_entity_1.Message('1', 'c1', 'Laila', new Date('2026-02-06T10:00:00Z'), message_status_enum_1.MessageStatus.SENT);
        const m2 = new message_entity_1.Message('2', 'c2', 'lAiLa', new Date('2026-02-06T11:00:00Z'), message_status_enum_1.MessageStatus.SENT);
        const m3 = new message_entity_1.Message('3', 'c3', 'joao', new Date('2026-02-06T12:00:00Z'), message_status_enum_1.MessageStatus.SENT);
        await repo.save(m1);
        await repo.save(m2);
        await repo.save(m3);
        const result = await repo.findBySender('laila');
        expect(result.map(m => m.id).sort()).toEqual(['1', '2']);
    });
    it('should find by period', async () => {
        const repo = new in_memory_message_repository_1.InMemoryMessageRepository();
        await repo.save(new message_entity_1.Message('1', 'c1', 'a', new Date('2026-02-01T10:00:00Z'), message_status_enum_1.MessageStatus.SENT));
        await repo.save(new message_entity_1.Message('2', 'c2', 'a', new Date('2026-02-10T10:00:00Z'), message_status_enum_1.MessageStatus.SENT));
        await repo.save(new message_entity_1.Message('3', 'c3', 'a', new Date('2026-03-01T10:00:00Z'), message_status_enum_1.MessageStatus.SENT));
        const start = new Date('2026-02-01T00:00:00Z');
        const end = new Date('2026-02-28T23:59:59.999Z');
        const result = await repo.findByPeriod(start, end);
        expect(result.map(m => m.id).sort()).toEqual(['1', '2']);
    });
});
//# sourceMappingURL=in-memory-message.repository.spec.js.map