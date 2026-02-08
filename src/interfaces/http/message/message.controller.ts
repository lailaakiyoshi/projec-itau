import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/infrastructure/auth/jwt-auth.guard';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListMessagesQueryDto } from './dto/list-messages.query.dto';

import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';

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

  /**
   * GET /messages?sender=...
   * GET /messages?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
   */
  @Get()
  list(@Query() query: ListMessagesQueryDto) {
    const { sender, startDate, endDate } = query;

    if (sender) {
      return this.getBySenderUseCase.execute(sender);
    }

    if (startDate || endDate) {
      if (!startDate || !endDate) {
        throw new BadRequestException(
          'Provide both startDate and endDate in format YYYY-MM-DD (e.g., 2026-02-06).',
        );
      }

      const start = new Date(`${startDate}T00:00:00-03:00`);
      const endInclusive = new Date(`${endDate}T23:59:59.999-03:00`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(endInclusive.getTime())) {
        throw new BadRequestException(
          'Invalid date. Use YYYY-MM-DD (e.g., 2026-02-06).',
        );
      }

      if (start > endInclusive) {
        throw new BadRequestException('startDate must be <= endDate.');
      }

      return this.getByPeriodUseCase.execute(start, endInclusive);
    }

    throw new BadRequestException(
      'Provide sender OR (startDate and endDate).',
    );
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.updateStatusUseCase.execute(id, dto.status);
  }
}
