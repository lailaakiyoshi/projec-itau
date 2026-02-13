import { MessageRepository } from '../../application/message/ports/message.repository';
import { Message } from '../../domain/message/message.entity';
export declare class MessageDynamoRepository extends MessageRepository {
    private readonly tableName;
    private readonly docClient;
    constructor();
    save(message: Message): Promise<void>;
    update(message: Message): Promise<void>;
    findById(id: string): Promise<Message | null>;
    findBySender(sender: string): Promise<Message[]>;
    findByPeriod(start: Date, end: Date): Promise<Message[]>;
    private mapToPersistence;
    private mapToDomain;
}
