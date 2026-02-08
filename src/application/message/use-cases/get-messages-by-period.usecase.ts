import { Inject, Injectable } from '@nestjs/common';
import { MessageRepository } from '../ports/message.repository';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';
import { Message } from '@/domain/message/message.entity';

@Injectable()
export class GetMessagesByPeriodUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(start: Date, end: Date): Promise<Message[]> {
    return this.repository.findByPeriod(start, end);
  }
}
