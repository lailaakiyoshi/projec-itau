import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterMessagesDto {
  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
