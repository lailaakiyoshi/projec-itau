import { Message } from '../../../domain/message/message.entity';
/**
 * Interface que define o contrato de persistência.
 * O domínio e os casos de uso dependem dessa interface,
 * não da implementação concreta.
 */
export declare abstract class MessageRepository {
    abstract save(message: Message): Promise<void>;
    abstract findById(id: string): Promise<Message | null>;
    abstract findBySender(sender: string): Promise<Message[]>;
    abstract findByPeriod(start: Date, end: Date): Promise<Message[]>;
    abstract update(message: Message): Promise<void>;
}
