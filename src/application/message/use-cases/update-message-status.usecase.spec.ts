import { NotFoundException } from '@nestjs/common';
import { UpdateMessageStatusUseCase } from './update-message-status.usecase';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';

describe('UpdateMessageStatusUseCase', () => {
  it('should update status and persist', async () => {
    const msg = new Message('id', 'c', 's', new Date(), MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.READ);

    expect(result.status).toBe(MessageStatus.READ);
    expect(repo.update).toHaveBeenCalledWith(msg);
  });

  it('should throw NotFoundException if not found', async () => {
    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(useCase.execute('x', MessageStatus.READ)).rejects.toBeInstanceOf(NotFoundException);
  });
});
