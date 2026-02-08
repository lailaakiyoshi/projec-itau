import { MessageRepository } from '@/application/message/ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryMessageRepository implements MessageRepository {
  private messages = new Map<string, Message>();

  async save(message: Message): Promise<void> {
    this.messages.set(message.id, message);
  }

  async findById(id: string): Promise<Message | null> {
    return this.messages.get(id) ?? null;
  }

  async findBySender(sender: string): Promise<Message[]> {
     const normalizedSender = sender.trim().toLowerCase();

  return [...this.messages.values()].filter(
    message => message.sender.toLowerCase() === normalizedSender,
  );
  }

  async findByPeriod(start: Date, end: Date): Promise<Message[]> {
    return [...this.messages.values()].filter(
      message =>
        message.sentAt >= start && message.sentAt <= end,
    );
  }

  async update(message: Message): Promise<void> {
    this.messages.set(message.id, message);
  }
}
