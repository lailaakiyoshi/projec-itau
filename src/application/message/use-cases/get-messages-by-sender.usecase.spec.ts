import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetMessagesBySenderUseCase } from './get-messages-by-sender.usecase';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';

describe('GetMessagesBySenderUseCase', () => {
  it('should call repository.findBySender and return messages when found', async () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    const repo: Partial<MessageRepository> = {
      findBySender: jest.fn().mockResolvedValue([msg]),
    };

    const useCase = new (GetMessagesBySenderUseCase as any)(repo);

    const result = await useCase.execute('sender');

    expect(repo.findBySender).toHaveBeenCalledTimes(1);
    expect(repo.findBySender).toHaveBeenCalledWith('sender');
    expect(result).toEqual([msg]);
  });

  it('should throw NotFoundException when sender has no messages', async () => {
    const repo: Partial<MessageRepository> = {
      findBySender: jest.fn().mockResolvedValue([]),
    };

    const useCase = new (GetMessagesBySenderUseCase as any)(repo);

    await expect(useCase.execute('sender')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repo.findBySender).toHaveBeenCalledTimes(1);
    expect(repo.findBySender).toHaveBeenCalledWith('sender');
  });

  it('should throw BadRequestException when sender is empty', async () => {
    const repo: Partial<MessageRepository> = {
      findBySender: jest.fn(),
    };

    const useCase = new (GetMessagesBySenderUseCase as any)(repo);

    await expect(useCase.execute('')).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findBySender).not.toHaveBeenCalled();
  });
});
