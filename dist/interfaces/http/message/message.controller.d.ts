import { CreateMessageDto } from './dto/create-message.dto';
import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';
export declare class MessageController {
    private readonly createUseCase;
    private readonly getByIdUseCase;
    private readonly getBySenderUseCase;
    private readonly getByPeriodUseCase;
    private readonly updateStatusUseCase;
    constructor(createUseCase: CreateMessageUseCase, getByIdUseCase: GetMessageByIdUseCase, getBySenderUseCase: GetMessagesBySenderUseCase, getByPeriodUseCase: GetMessagesByPeriodUseCase, updateStatusUseCase: UpdateMessageStatusUseCase);
    /**
     * POST /messages
     * Cria uma nova mensagem
     */
    create(dto: CreateMessageDto): Promise<import("../../../domain/message/message.entity").Message>;
    /**
     * GET /messages/sender/:sender
     * Busca mensagens por remetente
     *
     * IMPORTANTE: rotas específicas devem vir ANTES de rotas dinâmicas (/:id),
     * senão "sender" pode ser interpretado como um id.
     */
    findBySender(sender: string): Promise<import("../../../domain/message/message.entity").Message[]>;
    /**
     * GET /messages/period?start=YYYY-MM-DD&end=YYYY-MM-DD
     * Busca mensagens por período
     *
     * IMPORTANTE: rota específica deve vir ANTES de (/:id),
     * senão "period" pode ser interpretado como um id.
     */
    findByPeriod(start: string, end: string): Promise<import("../../../domain/message/message.entity").Message[]>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("../../../domain/message/message.entity").Message>;
    /**
     * GET /messages/:id
     * Busca uma mensagem por ID
     *
     * IMPORTANTE: deixe por último para não "capturar" rotas específicas como /period
     */
    findById(id: string): Promise<import("../../../domain/message/message.entity").Message>;
}
