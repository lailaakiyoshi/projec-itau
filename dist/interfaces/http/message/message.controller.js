"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const create_message_dto_1 = require("./dto/create-message.dto");
const create_message_usecase_1 = require("../../../application/message/use-cases/create-message.usecase");
const get_message_by_id_usecase_1 = require("../../../application/message/use-cases/get-message-by-id.usecase");
const get_messages_by_sender_usecase_1 = require("../../../application/message/use-cases/get-messages-by-sender.usecase");
const get_messages_by_period_usecase_1 = require("../../../application/message/use-cases/get-messages-by-period.usecase");
const common_2 = require("@nestjs/common");
const update_status_dto_1 = require("./dto/update-status.dto");
const update_message_status_usecase_1 = require("../../../application/message/use-cases/update-message-status.usecase");
const common_3 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../infrastructure/auth/jwt-auth.guard");
let MessageController = class MessageController {
    constructor(createUseCase, getByIdUseCase, getBySenderUseCase, getByPeriodUseCase, updateStatusUseCase) {
        this.createUseCase = createUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.getBySenderUseCase = getBySenderUseCase;
        this.getByPeriodUseCase = getByPeriodUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
    }
    /**
     * POST /messages
     * Cria uma nova mensagem
     */
    create(dto) {
        return this.createUseCase.execute(dto);
    }
    /**
     * GET /messages/sender/:sender
     * Busca mensagens por remetente
     *
     * IMPORTANTE: rotas específicas devem vir ANTES de rotas dinâmicas (/:id),
     * senão "sender" pode ser interpretado como um id.
     */
    findBySender(sender) {
        if (!sender?.trim()) {
            throw new common_1.BadRequestException('sender is required');
        }
        return this.getBySenderUseCase.execute(sender);
    }
    /**
     * GET /messages/period?start=YYYY-MM-DD&end=YYYY-MM-DD
     * Busca mensagens por período
     *
     * IMPORTANTE: rota específica deve vir ANTES de (/:id),
     * senão "period" pode ser interpretado como um id.
     */
    findByPeriod(start, end) {
        if (!start || !end) {
            throw new common_1.BadRequestException('Provide both start and end (YYYY-MM-DD or ISO).');
        }
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            throw new common_1.BadRequestException('Invalid start/end. Use YYYY-MM-DD or ISO.');
        }
        // end inclusivo (fim do dia) para casos em que veio só YYYY-MM-DD
        const endInclusive = new Date(endDate);
        endInclusive.setHours(23, 59, 59, 999);
        if (startDate > endInclusive) {
            throw new common_1.BadRequestException('start must be <= end.');
        }
        return this.getByPeriodUseCase.execute(startDate, endInclusive);
    }
    updateStatus(id, dto) {
        return this.updateStatusUseCase.execute(id, dto.status);
    }
    /**
     * GET /messages/:id
     * Busca uma mensagem por ID
     *
     * IMPORTANTE: deixe por último para não "capturar" rotas específicas como /period
     */
    findById(id) {
        return this.getByIdUseCase.execute(id);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('sender/:sender'),
    __param(0, (0, common_1.Param)('sender')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findBySender", null);
__decorate([
    (0, common_1.Get)('period'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findByPeriod", null);
__decorate([
    (0, common_2.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findById", null);
exports.MessageController = MessageController = __decorate([
    (0, common_3.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [create_message_usecase_1.CreateMessageUseCase,
        get_message_by_id_usecase_1.GetMessageByIdUseCase,
        get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase,
        get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase,
        update_message_status_usecase_1.UpdateMessageStatusUseCase])
], MessageController);
//# sourceMappingURL=message.controller.js.map