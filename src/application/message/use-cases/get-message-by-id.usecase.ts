import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '../../../domain/message/message.entity';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';

@Injectable()
export class GetMessageByIdUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(id: string): Promise<Message> {
    const message = await this.repository.findById(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }
}
