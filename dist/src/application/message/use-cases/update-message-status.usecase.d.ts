import { MessageRepository } from '../ports/message.repository';
import { MessageStatus } from '@/domain/message/message-status.enum';
export declare class UpdateMessageStatusUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(id: string, status: MessageStatus): Promise<import("../../../domain/message/message.entity").Message>;
}
