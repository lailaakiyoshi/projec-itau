import { MessageRepository } from '@/application/message/ports/message.repository';
export declare class GetMessagesBySenderUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(sender: string): Promise<import("../../../domain/message/message.entity").Message[]>;
}
