import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (!id || id.trim().length === 0) {
      throw new BadRequestException('id is required');
    }

    if (!status) {
      throw new BadRequestException('status is required');
    }

    const message = await this.repository.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with id "${id}" not found`);
    }

    if (message.status === status) {
      return message;
    }

    try {
      message.updateStatus(status);
    } catch (err) {
      throw new BadRequestException((err as Error).message);
    }

    await this.repository.update(message);
    return message;
  }
}
