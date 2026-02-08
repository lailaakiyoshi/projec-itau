import { MessageStatus } from './message-status.enum';

export class Message {
  constructor(
    public readonly id: string,
    public content: string,
    public sender: string,
    public sentAt: Date,
    public status: MessageStatus,
  ) {}

  markAsReceived() {
    if (this.status !== MessageStatus.SENT) {
      throw new Error('Invalid status transition');
    }
    this.status = MessageStatus.RECEIVED;
  }

  markAsRead() {
    if (this.status !== MessageStatus.RECEIVED) {
      throw new Error('Invalid status transition');
    }
    this.status = MessageStatus.READ;
  }

   updateStatus(next: MessageStatus) {
    if (this.status === next) return;
    this.status = next;
  }
}
