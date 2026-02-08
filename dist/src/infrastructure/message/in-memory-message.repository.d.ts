import { MessageRepository } from '@/application/message/ports/message.repository';
import { Message } from '@/domain/message/message.entity';
export declare class InMemoryMessageRepository implements MessageRepository {
    private messages;
    save(message: Message): Promise<void>;
    findById(id: string): Promise<Message | null>;
    findBySender(sender: string): Promise<Message[]>;
    findByPeriod(start: Date, end: Date): Promise<Message[]>;
    update(message: Message): Promise<void>;
}
