import { MessageStatus } from './message-status.enum';
export declare class Message {
    readonly id: string;
    content: string;
    sender: string;
    sentAt: Date;
    status: MessageStatus;
    constructor(id: string, content: string, sender: string, sentAt: Date, status: MessageStatus);
    markAsReceived(): void;
    markAsRead(): void;
    updateStatus(next: MessageStatus): void;
}
