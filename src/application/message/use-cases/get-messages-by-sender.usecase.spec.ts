import { GetMessagesBySenderUseCase } from './get-messages-by-sender.usecase';
import { MessageRepository } from '../ports/message.repository';

describe('GetMessagesBySenderUseCase', () => {
  it('should call repository.findBySender', async () => {
    const repo: Partial<MessageRepository> = {
      findBySender: jest.fn().mockResolvedValue([]),
    };

    const useCase = new GetMessagesBySenderUseCase(repo as any);

    await useCase.execute('laila');

    expect(repo.findBySender).toHaveBeenCalledWith('laila');
  });
});
