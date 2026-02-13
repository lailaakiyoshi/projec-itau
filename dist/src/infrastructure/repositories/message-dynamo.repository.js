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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDynamoRepository = void 0;
const common_1 = require("@nestjs/common");
const message_repository_1 = require("../../application/message/ports/message.repository");
const message_entity_1 = require("../../domain/message/message.entity");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
let MessageDynamoRepository = class MessageDynamoRepository extends message_repository_1.MessageRepository {
    constructor() {
        super();
        this.tableName = process.env.DYNAMO_TABLE_NAME || 'Messages';
        const client = new client_dynamodb_1.DynamoDBClient({
            region: process.env.AWS_REGION,
            endpoint: process.env.DYNAMO_ENDPOINT,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake'
            }
        });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    }
    async save(message) {
        const item = this.mapToPersistence(message);
        await this.docClient.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: item,
        }));
    }
    async update(message) {
        await this.save(message);
    }
    async findById(id) {
        const result = await this.docClient.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { id },
        }));
        if (!result.Item)
            return null;
        return this.mapToDomain(result.Item);
    }
    async findBySender(sender) {
        const result = await this.docClient.send(new lib_dynamodb_1.ScanCommand({
            TableName: this.tableName,
            FilterExpression: 'senderId = :senderId',
            ExpressionAttributeValues: { ':senderId': sender },
        }));
        return result.Items ? result.Items.map(item => this.mapToDomain(item)) : [];
    }
    async findByPeriod(start, end) {
        const result = await this.docClient.send(new lib_dynamodb_1.ScanCommand({
            TableName: this.tableName,
            FilterExpression: 'sentAt BETWEEN :start AND :end',
            ExpressionAttributeValues: {
                ':start': start.toISOString(),
                ':end': end.toISOString(),
            },
        }));
        return result.Items ? result.Items.map(item => this.mapToDomain(item)) : [];
    }
    mapToPersistence(message) {
        return {
            id: message.id,
            content: message.content,
            senderId: message.sender,
            sentAt: message.sentAt.toISOString(),
            status: message.status,
        };
    }
    mapToDomain(item) {
        return new message_entity_1.Message(item.id, item.content, item.senderId, new Date(item.sentAt), item.status);
    }
};
exports.MessageDynamoRepository = MessageDynamoRepository;
exports.MessageDynamoRepository = MessageDynamoRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MessageDynamoRepository);
//# sourceMappingURL=message-dynamo.repository.js.map