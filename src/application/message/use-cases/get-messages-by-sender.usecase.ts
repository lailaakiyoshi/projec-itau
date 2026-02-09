import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';
import { MessageRepository } from '../ports/message.repository';

@Injectable()
export class GetMessagesBySenderUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(sender: string) {
    if (!sender || sender.trim().length === 0) {
      throw new BadRequestException('sender is required');
    }

    const normalizedSender = sender.trim();

    const messages = await this.repository.findBySender(normalizedSender);

    if (!messages || messages.length === 0) {
      throw new NotFoundException('Sender not found');
    }

    return messages;
  }
}
