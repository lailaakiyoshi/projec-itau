"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_entity_1 = require("./message.entity");
const message_status_enum_1 = require("./message-status.enum");
describe('Message Entity', () => {
    it('should update status', () => {
        const msg = new message_entity_1.Message('id-1', 'conteudo', 'laila', new Date(), message_status_enum_1.MessageStatus.SENT);
        msg.updateStatus(message_status_enum_1.MessageStatus.READ);
        expect(msg.status).toBe(message_status_enum_1.MessageStatus.READ);
    });
});
//# sourceMappingURL=message.entity.spec.js.map