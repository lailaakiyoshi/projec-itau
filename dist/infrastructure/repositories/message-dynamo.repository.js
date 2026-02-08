"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDynamoRepository = void 0;
const common_1 = require("@nestjs/common");
let MessageDynamoRepository = class MessageDynamoRepository {
    async save(message) {
        console.log('Persistindo mensagem:', message);
        // putItem
    }
    async findById(id) {
        // getItem
        return null;
    }
    async findBySender(sender) {
        return [];
    }
    async findByPeriod(start, end) {
        return [];
    }
    async update(message) {
        // updateItem
    }
};
exports.MessageDynamoRepository = MessageDynamoRepository;
exports.MessageDynamoRepository = MessageDynamoRepository = __decorate([
    (0, common_1.Injectable)()
], MessageDynamoRepository);
//# sourceMappingURL=message-dynamo.repository.js.map