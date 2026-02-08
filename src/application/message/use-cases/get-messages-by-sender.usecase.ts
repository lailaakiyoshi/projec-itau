import { Inject, Injectable } from '@nestjs/common';
import { MessageRepository } from '../ports/message.repository';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';
import { Message } from '@/domain/message/message.entity';

@Injectable()
export class GetMessagesBySenderUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(sender: string): Promise<Message[]> {
    return this.repository.findBySender(sender);
  }
}
