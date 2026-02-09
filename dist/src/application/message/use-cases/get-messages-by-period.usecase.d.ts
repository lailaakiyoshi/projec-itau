import { MessageRepository } from '../ports/message.repository';
export declare class GetMessagesByPeriodUseCase {
    private readonly repository;
    constructor(repository: MessageRepository);
    execute(startDate: string, endDate: string): Promise<import("../../../domain/message/message.entity").Message[]>;
}
