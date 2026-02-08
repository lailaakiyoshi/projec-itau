import { MessageRepository } from '../ports/message.repository';
import { Message } from '../../../domain/message/message.entity';
export declare class GetMessageByIdUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(id: string): Promise<Message>;
}
