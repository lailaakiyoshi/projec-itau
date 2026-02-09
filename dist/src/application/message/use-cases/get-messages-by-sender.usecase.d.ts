import { MessageRepository } from '../ports/message.repository';
import { Message } from '../../../domain/message/message.entity';
export declare class GetMessagesBySenderUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(sender: string): Promise<Message[]>;
}
