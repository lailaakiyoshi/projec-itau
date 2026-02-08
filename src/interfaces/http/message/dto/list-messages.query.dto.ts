import { IsOptional, Matches, IsString, MaxLength } from 'class-validator';
import { Transform as ClassTransform } from 'class-transformer';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class ListMessagesQueryDto {
  @IsOptional()
  @ClassTransform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(80)
  sender?: string;

  @IsOptional()
  @Matches(DATE_ONLY_REGEX, {
    message: 'startDate must be in format YYYY-MM-DD (e.g., 2026-02-06)',
  })
  startDate?: string;

  @IsOptional()
  @Matches(DATE_ONLY_REGEX, {
    message: 'endDate must be in format YYYY-MM-DD (e.g., 2026-02-08)',
  })
  endDate?: string;
}
