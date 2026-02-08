import { Injectable } from '@nestjs/common';
import { MessageRepository } from 'src/application/message/ports/message.repository'; 
import { Message } from 'src/domain/message/message.entity'; 

@Injectable()
export class MessageDynamoRepository implements MessageRepository {
  async save(message: Message): Promise<void> {
    console.log('Persistindo mensagem:', message);
  }

  async findById(id: string): Promise<Message | null> {
    return null;
  }

  async findBySender(sender: string): Promise<Message[]> {
    return [];
  }

  async findByPeriod(start: Date, end: Date): Promise<Message[]> {
    return [];
  }

  async update(message: Message): Promise<void> {
  }
}
