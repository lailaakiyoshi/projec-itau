import { Message } from '@/domain/message/message.entity';
import { MessageRepository } from '../ports/message.repository';
export declare class CreateMessageUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(input: {
        content: string;
        sender: string;
    }): Promise<Message>;
}
