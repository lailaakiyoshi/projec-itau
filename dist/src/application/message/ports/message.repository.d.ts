import { Message } from '../../../domain/message/message.entity';
export declare abstract class MessageRepository {
    abstract save(message: Message): Promise<void>;
    abstract findById(id: string): Promise<Message | null>;
    abstract findBySender(sender: string): Promise<Message[]>;
    abstract findByPeriod(start: Date, end: Date): Promise<Message[]>;
    abstract update(message: Message): Promise<void>;
}
