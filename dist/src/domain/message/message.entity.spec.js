"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_entity_1 = require("./message.entity");
const message_status_enum_1 = require("./message-status.enum");
describe('Message Entity', () => {
    it('should update status from SENT to RECEIVED', () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        msg.updateStatus(message_status_enum_1.MessageStatus.RECEIVED);
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.RECEIVED);
    });
    it('should update status from RECEIVED to READ', () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.RECEIVED);
        msg.updateStatus(message_status_enum_1.MessageStatus.READ);
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.READ);
    });
    it('should throw error for invalid transition (SENT -> READ)', () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        expect(() => msg.updateStatus(message_status_enum_1.MessageStatus.READ)).toThrow('Invalid status transition: SENT -> READ');
    });
    it('should not change status if same status is provided', () => {
        const msg = new message_entity_1.Message('id', 'conteudo', 'sender', new Date(), message_status_enum_1.MessageStatus.SENT);
        msg.updateStatus(message_status_enum_1.MessageStatus.SENT);
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.SENT);
    });
    it('should mark as received only when status is SENT', () => {
        const msg = new message_entity_1.Message('id', 'c', 's', new Date(), message_status_enum_1.MessageStatus.SENT);
        msg.markAsReceived();
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.RECEIVED);
    });
    it('should throw when markAsReceived is called and status is not SENT', () => {
        const msg = new message_entity_1.Message('id', 'c', 's', new Date(), message_status_enum_1.MessageStatus.RECEIVED);
        expect(() => msg.markAsReceived()).toThrow();
    });
    it('should mark as read only when status is RECEIVED', () => {
        const msg = new message_entity_1.Message('id', 'c', 's', new Date(), message_status_enum_1.MessageStatus.RECEIVED);
        msg.markAsRead();
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.READ);
    });
    it('should throw when markAsRead is called and status is not RECEIVED', () => {
        const msg = new message_entity_1.Message('id', 'c', 's', new Date(), message_status_enum_1.MessageStatus.SENT);
        expect(() => msg.markAsRead()).toThrow();
    });
});
//# sourceMappingURL=message.entity.spec.js.map