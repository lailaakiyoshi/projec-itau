import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateMessageDto } from './dto/create-message.dto';
import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { Patch } from '@nestjs/common';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/infrastructure/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessageController {
  constructor(
    private readonly createUseCase: CreateMessageUseCase,
    private readonly getByIdUseCase: GetMessageByIdUseCase,
    private readonly getBySenderUseCase: GetMessagesBySenderUseCase,
    private readonly getByPeriodUseCase: GetMessagesByPeriodUseCase,
    private readonly updateStatusUseCase: UpdateMessageStatusUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.createUseCase.execute(dto);
  }

  @Get('sender/:sender')
  findBySender(@Param('sender') sender: string) {
    if (!sender?.trim()) {
      throw new BadRequestException('sender is required');
    }
    return this.getBySenderUseCase.execute(sender);
  }

  @Get('period')
  findByPeriod(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (!start || !end) {
      throw new BadRequestException(
        'Provide both start and end (YYYY-MM-DD or ISO).',
      );
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid start/end. Use YYYY-MM-DD or ISO.');
    }

    const endInclusive = new Date(endDate);
    endInclusive.setHours(23, 59, 59, 999);

    if (startDate > endInclusive) {
      throw new BadRequestException('start must be <= end.');
    }

    return this.getByPeriodUseCase.execute(startDate, endInclusive);
  }

  @Patch(':id/status')
  updateStatus(
  @Param('id') id: string,
  @Body() dto: UpdateStatusDto,
) {
  return this.updateStatusUseCase.execute(id, dto.status);
}

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getByIdUseCase.execute(id);
  }
}
