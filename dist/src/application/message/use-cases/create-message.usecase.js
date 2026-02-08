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
exports.CreateMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const message_entity_1 = require("../../../domain/message/message.entity");
const message_status_enum_1 = require("../../../domain/message/message-status.enum");
const message_repository_1 = require("../ports/message.repository");
const message_repository_token_1 = require("../ports/message-repository.token");
let CreateMessageUseCase = class CreateMessageUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        const message = new message_entity_1.Message((0, crypto_1.randomUUID)(), input.content, input.sender, new Date(), message_status_enum_1.MessageStatus.SENT);
        await this.repository.save(message);
        return message;
    }
};
exports.CreateMessageUseCase = CreateMessageUseCase;
exports.CreateMessageUseCase = CreateMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(message_repository_token_1.MESSAGE_REPOSITORY)),
    __metadata("design:paramtypes", [message_repository_1.MessageRepository])
], CreateMessageUseCase);
//# sourceMappingURL=create-message.usecase.js.map