import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
export declare class GetMessagesByPeriodUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(start: Date, end: Date): Promise<Message[]>;
}
