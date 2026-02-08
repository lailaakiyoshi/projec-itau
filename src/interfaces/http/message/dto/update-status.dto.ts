import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { MessageStatus } from '@/domain/message/message-status.enum';

export class UpdateStatusDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsEnum(MessageStatus)
  status!: MessageStatus;
}
