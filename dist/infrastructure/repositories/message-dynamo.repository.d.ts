import { MessageRepository } from 'src/application/message/ports/message.repository';
import { Message } from 'src/domain/message/message.entity';
export declare class MessageDynamoRepository implements MessageRepository {
    save(message: Message): Promise<void>;
    findById(id: string): Promise<Message | null>;
    findBySender(sender: string): Promise<Message[]>;
    findByPeriod(start: Date, end: Date): Promise<Message[]>;
    update(message: Message): Promise<void>;
}
