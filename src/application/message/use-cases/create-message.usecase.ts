import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';
import { MessageRepository } from '../ports/message.repository';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(input: { content: string; sender: string }) {
    const message = new Message(
      randomUUID(),
      input.content,
      input.sender,
      new Date(),
      MessageStatus.SENT,
    );

    await this.repository.save(message);
    return message;
  }
}
