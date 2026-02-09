import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetMessagesByPeriodUseCase } from './get-messages-by-period.usecase';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';

describe('GetMessagesByPeriodUseCase', () => {
  it('should return messages when found', async () => {
    const msg = new Message('id', 'conteudo', 'sender', new Date(), MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn().mockResolvedValue([msg]),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    const result = await useCase.execute('2026-02-01', '2026-02-02');

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should throw NotFoundException when no messages are found for period', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn().mockResolvedValue([]),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    await expect(useCase.execute('2026-02-01', '2026-02-02')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw BadRequestException when startDate is missing', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn(),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    await expect(useCase.execute('', '2026-02-02')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findByPeriod).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when endDate is missing', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn(),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    await expect(useCase.execute('2026-02-01', '')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findByPeriod).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when date format is invalid', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn(),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    await expect(useCase.execute('2026/02/01', '2026-02-02')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findByPeriod).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when startDate > endDate', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn(),
    };

    const useCase = new (GetMessagesByPeriodUseCase as any)(repo);

    await expect(useCase.execute('2026-02-10', '2026-02-02')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findByPeriod).not.toHaveBeenCalled();
  });
});
