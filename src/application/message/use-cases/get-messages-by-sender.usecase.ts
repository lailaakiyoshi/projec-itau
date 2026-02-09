import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '@/application/message/ports/message-repository.token';
import { MessageRepository } from '@/application/message/ports/message.repository';

@Injectable()
export class GetMessagesBySenderUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(sender: string) {
    const messages = await this.repository.findBySender(sender);

    if (!messages || messages.length === 0) {
      throw new NotFoundException('Sender not found');
    }

    return messages;
  }
}
