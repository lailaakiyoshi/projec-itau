import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateMessageStatusUseCase } from './update-message-status.usecase';
import { MessageRepository } from '../ports/message.repository';
import { Message } from '@/domain/message/message.entity';
import { MessageStatus } from '@/domain/message/message-status.enum';

describe('UpdateMessageStatusUseCase', () => {
  const makeMessage = (status: MessageStatus) =>
    new Message('id', 'conteudo', 'sender', new Date(), status);

  it('should update status from SENT to RECEIVED and persist', async () => {
    const msg = makeMessage(MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.RECEIVED);

    expect(result.status).toBe(MessageStatus.RECEIVED);
    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.update).toHaveBeenCalledWith(msg);
    expect(msg.status).toBe(MessageStatus.RECEIVED);
  });

  it('should update status from RECEIVED to READ and persist', async () => {
    const msg = makeMessage(MessageStatus.RECEIVED);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.READ);

    expect(result.status).toBe(MessageStatus.READ);
    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(repo.update).toHaveBeenCalledWith(msg);
    expect(msg.status).toBe(MessageStatus.READ);
  });

  it('should throw BadRequestException for invalid status transition (SENT -> READ)', async () => {
    const msg = makeMessage(MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(useCase.execute('id', MessageStatus.READ)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.update).not.toHaveBeenCalled();
    expect(msg.status).toBe(MessageStatus.SENT);
  });

  it('should throw NotFoundException if message is not found', async () => {
    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(useCase.execute('x', MessageStatus.READ)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repo.update).not.toHaveBeenCalled();
  });

  it('should not persist when status is already the same', async () => {
    const msg = makeMessage(MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    const result = await useCase.execute('id', MessageStatus.SENT);

    expect(result.status).toBe(MessageStatus.SENT);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when id is empty', async () => {
    const repo: Partial<MessageRepository> = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(useCase.execute('', MessageStatus.RECEIVED)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.findById).not.toHaveBeenCalled();
    expect(repo.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when status is invalid (undefined)', async () => {
    const msg = makeMessage(MessageStatus.SENT);

    const repo: Partial<MessageRepository> = {
      findById: jest.fn().mockResolvedValue(msg),
      update: jest.fn(),
    };

    const useCase = new (UpdateMessageStatusUseCase as any)(repo);

    await expect(useCase.execute('id', undefined as any)).rejects.toBeInstanceOf(
      BadRequestException,
    );

    expect(repo.update).not.toHaveBeenCalled();
  });
});
