import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../application/message/ports/message.repository'; 
import { Message } from '../../domain/message/message.entity'; 
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

@Injectable()
export class MessageDynamoRepository extends MessageRepository { 
  private readonly tableName = process.env.DYNAMO_TABLE_NAME || 'Messages';
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    super(); 
    const client = new DynamoDBClient({ 
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMO_ENDPOINT,      
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake'
      }
    });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async save(message: Message): Promise<void> {
    const item = this.mapToPersistence(message);
    
    await this.docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: item,
    }));
  }

  async update(message: Message): Promise<void> {
    await this.save(message);
  }

  async findById(id: string): Promise<Message | null> {
    const result = await this.docClient.send(new GetCommand({
      TableName: this.tableName,
      Key: { id },
    }));

    if (!result.Item) return null;
    return this.mapToDomain(result.Item);
  }

  async findBySender(sender: string): Promise<Message[]> {
    const result = await this.docClient.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'senderId = :senderId',
      ExpressionAttributeValues: { ':senderId': sender },
    }));

    return result.Items ? result.Items.map(item => this.mapToDomain(item)) : [];
  }

  async findByPeriod(start: Date, end: Date): Promise<Message[]> {
    const result = await this.docClient.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: 'sentAt BETWEEN :start AND :end', 
      ExpressionAttributeValues: {
        ':start': start.toISOString(),
        ':end': end.toISOString(),
      },
    }));

    return result.Items ? result.Items.map(item => this.mapToDomain(item)) : [];
  }

  private mapToPersistence(message: Message) {
    return {
      id: message.id,
      content: message.content,
      senderId: message.sender, 
      sentAt: message.sentAt.toISOString(), 
      status: message.status,
    };
  }

  private mapToDomain(item: any): Message {
    return new Message(
      item.id,
      item.content,
      item.senderId,
      new Date(item.sentAt), 
      item.status
    );
  }
}