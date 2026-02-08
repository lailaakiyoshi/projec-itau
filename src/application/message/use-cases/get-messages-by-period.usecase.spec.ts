import { GetMessagesByPeriodUseCase } from './get-messages-by-period.usecase';
import { MessageRepository } from '../ports/message.repository';

describe('GetMessagesByPeriodUseCase', () => {
  it('should call repository.findByPeriod', async () => {
    const repo: Partial<MessageRepository> = {
      findByPeriod: jest.fn().mockResolvedValue([]),
    };

    const useCase = new GetMessagesByPeriodUseCase(repo as any);

    const start = new Date('2026-02-01T00:00:00Z');
    const end = new Date('2026-02-28T23:59:59.999Z');

    await useCase.execute(start, end);

    expect(repo.findByPeriod).toHaveBeenCalledWith(start, end);
  });
});
