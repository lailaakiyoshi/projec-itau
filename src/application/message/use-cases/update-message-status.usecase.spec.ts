import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateMessageStatusUseCase } from './update-message-status.usecase';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';

describe('UpdateMessageStatusUseCase', () => {

  it('should update status from SENT to RECEIVED and persist', async () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.RECEIVED);

    expect(result.status).toBe(MessageStatus.RECEIVED);
    expect(repo.update).toHaveBeenCalledWith(msg);
  });

  it('should update status from RECEIVED to READ and persist', async () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.RECEIVED,
    );

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.READ);

    expect(result.status).toBe(MessageStatus.READ);
    expect(repo.update).toHaveBeenCalledWith(msg);
  });

  it('should throw BadRequestException for invalid status transition (SENT -> READ)', async () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(
      useCase.execute('id', MessageStatus.READ),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if message is not found', async () => {
    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(
      useCase.execute('x', MessageStatus.READ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should not persist when status is already the same', async () => {
  const msg = new Message('id', 'c', 's', new Date(), MessageStatus.SENT);

  const repo: Partial<MessageRepository> = {
    findById: jest.fn().mockResolvedValue(msg),
    update: jest.fn(),
  };

  const useCase = new (UpdateMessageStatusUseCase as any)(repo);

  const result = await useCase.execute('id', MessageStatus.SENT);

  expect(result.status).toBe(MessageStatus.SENT);
  expect(repo.update).not.toHaveBeenCalled();
});

});
