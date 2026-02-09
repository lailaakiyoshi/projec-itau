"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_controller_1 = require("./message.controller");
const create_message_usecase_1 = require("../../../application/message/use-cases/create-message.usecase");
const get_message_by_id_usecase_1 = require("../../../application/message/use-cases/get-message-by-id.usecase");
const get_messages_by_sender_usecase_1 = require("../../../application/message/use-cases/get-messages-by-sender.usecase");
const get_messages_by_period_usecase_1 = require("../../../application/message/use-cases/get-messages-by-period.usecase");
const update_message_status_usecase_1 = require("../../../application/message/use-cases/update-message-status.usecase");
const message_repository_token_1 = require("../../../application/message/ports/message-repository.token");
const in_memory_message_repository_1 = require("../../../infrastructure/message/in-memory-message.repository");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        controllers: [message_controller_1.MessageController],
        providers: [
            in_memory_message_repository_1.InMemoryMessageRepository,
            {
                provide: message_repository_token_1.MESSAGE_REPOSITORY,
                useExisting: in_memory_message_repository_1.InMemoryMessageRepository,
            },
            create_message_usecase_1.CreateMessageUseCase,
            get_message_by_id_usecase_1.GetMessageByIdUseCase,
            get_messages_by_sender_usecase_1.GetMessagesBySenderUseCase,
            get_messages_by_period_usecase_1.GetMessagesByPeriodUseCase,
            update_message_status_usecase_1.UpdateMessageStatusUseCase,
        ],
        exports: [message_repository_token_1.MESSAGE_REPOSITORY],
    })
], MessageModule);
//# sourceMappingURL=message.module.js.map