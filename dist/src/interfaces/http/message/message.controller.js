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
const jwt_auth_guard_1 = require("../../../infrastructure/auth/jwt-auth.guard");
const create_message_dto_1 = require("./dto/create-message.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const list_messages_query_dto_1 = require("./dto/list-messages.query.dto");
const create_message_usecase_1 = require("../../../application/message/use-cases/create-message.usecase");
const get_message_by_id_usecase_1 = require("../../../application/message/use-cases/get-message-by-id.usecase");
const get_messages_by_sender_usecase_1 = require("../../../application/message/use-cases/get-messages-by-sender.usecase");
const get_messages_by_period_usecase_1 = require("../../../application/message/use-cases/get-messages-by-period.usecase");
const update_message_status_usecase_1 = require("../../../application/message/use-cases/update-message-status.usecase");
let MessageController = class MessageController {
    constructor(createUseCase, getByIdUseCase, getBySenderUseCase, getByPeriodUseCase, updateStatusUseCase) {
        this.createUseCase = createUseCase;
        this.getByIdUseCase = getByIdUseCase;
        this.getBySenderUseCase = getBySenderUseCase;
        this.getByPeriodUseCase = getByPeriodUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
    }
    create(dto) {
        return this.createUseCase.execute(dto);
    }
    /**
     * GET /messages?sender=...
     * GET /messages?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
     */
    list(query) {
        const { sender, startDate, endDate } = query;
        if (sender) {
            return this.getBySenderUseCase.execute(sender);
        }
        if (startDate || endDate) {
            if (!startDate || !endDate) {
                throw new common_1.BadRequestException('Provide both startDate and endDate in format YYYY-MM-DD (e.g., 2026-02-06).');
            }
            const start = new Date(`${startDate}T00:00:00-03:00`);
            const endInclusive = new Date(`${endDate}T23:59:59.999-03:00`);
            if (Number.isNaN(start.getTime()) || Number.isNaN(endInclusive.getTime())) {
                throw new common_1.BadRequestException('Invalid date. Use YYYY-MM-DD (e.g., 2026-02-06).');
            }
            if (start > endInclusive) {
                throw new common_1.BadRequestException('startDate must be <= endDate.');
            }
            return this.getByPeriodUseCase.execute(start, endInclusive);
        }
        throw new common_1.BadRequestException('Provide sender OR (startDate and endDate).');
    }
    findById(id) {
        return this.getByIdUseCase.execute(id);
    }
    updateStatus(id, dto) {
        return this.updateStatusUseCase.execute(id, dto.status);
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
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_messages_query_dto_1.ListMessagesQueryDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "updateStatus", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [create_message_usecase_1.CreateMessageUseCase,
        get_message_by_id_usecase_1.GetMessageByIdUseCase,
        get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase,
        get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase,
        update_message_status_usecase_1.UpdateMessageStatusUseCase])
], MessageController);
//# sourceMappingURL=message.controller.js.map