import { MessageRepository } from '../ports/message.repository';
import { Message } from '../../../domain/message/message.entity';
/**
 * Caso de uso para filtros de mensagens.
 */
interface FilterInput {
    sender?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class GetMessagesUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(filters: FilterInput): Promise<Message[]>;
}
export {};
