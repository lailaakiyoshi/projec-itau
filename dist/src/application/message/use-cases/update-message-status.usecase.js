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
exports.UpdateMessageStatusUseCase = void 0;
const common_1 = require("@nestjs/common");
const message_repository_token_1 = require("../ports/message-repository.token");
const message_repository_1 = require("../ports/message.repository");
let UpdateMessageStatusUseCase = class UpdateMessageStatusUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(id, status) {
        if (!id || id.trim().length === 0) {
            throw new common_1.BadRequestException('id is required');
        }
        if (!status) {
            throw new common_1.BadRequestException('status is required');
        }
        const message = await this.repository.findById(id);
        if (!message) {
            throw new common_1.NotFoundException(`Message with id "${id}" not found`);
        }
        if (message.status === status) {
            return message;
        }
        try {
            message.updateStatus(status);
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
        await this.repository.update(message);
        return message;
    }
};
exports.UpdateMessageStatusUseCase = UpdateMessageStatusUseCase;
exports.UpdateMessageStatusUseCase = UpdateMessageStatusUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(message_repository_token_1.MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository])
], UpdateMessageStatusUseCase);
//# sourceMappingURL=update-message-status.usecase.js.map