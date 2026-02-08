import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MessageStatus } from '@/domain/message/message-status.enum';

export class UpdateStatusDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsNotEmpty()
  @IsEnum(MessageStatus)
  status!: MessageStatus;
}
