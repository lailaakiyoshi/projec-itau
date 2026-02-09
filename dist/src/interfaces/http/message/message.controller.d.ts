import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListMessagesQueryDto } from './dto/list-messages.query.dto';
import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';
export declare class MessageController {
    private readonly createUseCase;
    private readonly getByIdUseCase;
    private readonly getBySenderUseCase;
    private readonly getByPeriodUseCase;
    private readonly updateStatusUseCase;
    constructor(createUseCase: CreateMessageUseCase, getByIdUseCase: GetMessageByIdUseCase, getBySenderUseCase: GetMessagesBySenderUseCase, getByPeriodUseCase: GetMessagesByPeriodUseCase, updateStatusUseCase: UpdateMessageStatusUseCase);
    create(dto: CreateMessageDto): Promise<import("../../../domain/message/message.entity").Message>;
    list(query: ListMessagesQueryDto): Promise<import("../../../domain/message/message.entity").Message[]>;
    findById(id: string): Promise<import("../../../domain/message/message.entity").Message>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("../../../domain/message/message.entity").Message>;
}
