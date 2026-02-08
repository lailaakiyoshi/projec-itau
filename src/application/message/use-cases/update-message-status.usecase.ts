import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';
import { MessageRepository } from '../ports/message.repository';
import { MessageStatus } from '@/domain/message/message-status.enum';

@Injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(id: string, status: MessageStatus) {
    const message = await this.repository.findById(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.updateStatus(status);

    await this.repository.update(message);
    return message;
  }
}
