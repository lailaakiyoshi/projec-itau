import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../ports/message-repository.token';
import { MessageRepository } from '../ports/message.repository';

@Injectable()
export class GetMessagesByPeriodUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepository,
  ) {}

  async execute(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const start = new Date(`${startDate}T00:00:00.000Z`);
    const end = new Date(`${endDate}T23:59:59.999Z`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    if (start > end) {
      throw new BadRequestException('startDate must be less than or equal to endDate');
    }

    const messages = await this.repository.findByPeriod(start, end);

    if (!messages || messages.length === 0) {
      throw new NotFoundException('No messages found for the given period');
    }

    return messages;
  }
}
