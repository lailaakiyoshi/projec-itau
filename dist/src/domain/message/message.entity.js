"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const message_status_enum_1 = require("./message-status.enum");
class Message {
    constructor(id, content, sender, sentAt, status) {
        this.id = id;
        this.content = content;
        this.sender = sender;
        this.sentAt = sentAt;
        this.status = status;
    }
    markAsReceived() {
        if (this.status !== message_status_enum_1.MessageStatus.SENT) {
            throw new Error('Invalid status transition');
        }
        this.status = message_status_enum_1.MessageStatus.RECEIVED;
    }
    markAsRead() {
        if (this.status !== message_status_enum_1.MessageStatus.RECEIVED) {
            throw new Error('Invalid status transition');
        }
        this.status = message_status_enum_1.MessageStatus.READ;
    }
    updateStatus(next) {
        if (this.status === next)
            return;
        const allowed = {
            [message_status_enum_1.MessageStatus.SENT]: [message_status_enum_1.MessageStatus.RECEIVED],
            [message_status_enum_1.MessageStatus.RECEIVED]: [message_status_enum_1.MessageStatus.READ],
            [message_status_enum_1.MessageStatus.READ]: [],
        };
        if (!allowed[this.status].includes(next)) {
            throw new Error(`Invalid status transition: ${this.status} -> ${next}`);
        }
        this.status = next;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map