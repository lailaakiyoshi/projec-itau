import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class MessageQueryDto {
  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}
