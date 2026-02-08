import { Message } from './message.entity';
import { MessageStatus } from './message-status.enum';

describe('Message Entity', () => {
  it('should update status from SENT to RECEIVED', () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    msg.updateStatus(MessageStatus.RECEIVED);

    expect(msg.status).toBe(MessageStatus.RECEIVED);
  });

  it('should update status from RECEIVED to READ', () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.RECEIVED,
    );

    msg.updateStatus(MessageStatus.READ);

    expect(msg.status).toBe(MessageStatus.READ);
  });

  it('should throw error for invalid transition (SENT -> READ)', () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    expect(() => msg.updateStatus(MessageStatus.READ)).toThrow(
      'Invalid status transition: SENT -> READ',
    );
  });

  it('should not change status if same status is provided', () => {
    const msg = new Message(
      'id',
      'conteudo',
      'sender',
      new Date(),
      MessageStatus.SENT,
    );

    msg.updateStatus(MessageStatus.SENT);

    expect(msg.status).toBe(MessageStatus.SENT);
  });

  it('should mark as received only when status is SENT', () => {
  const msg = new Message('id', 'c', 's', new Date(), MessageStatus.SENT);

  msg.markAsReceived();

  expect(msg.status).toBe(MessageStatus.RECEIVED);
});

it('should throw when markAsReceived is called and status is not SENT', () => {
  const msg = new Message('id', 'c', 's', new Date(), MessageStatus.RECEIVED);

  expect(() => msg.markAsReceived()).toThrow();
});

it('should mark as read only when status is RECEIVED', () => {
  const msg = new Message('id', 'c', 's', new Date(), MessageStatus.RECEIVED);

  msg.markAsRead();

  expect(msg.status).toBe(MessageStatus.READ);
});

it('should throw when markAsRead is called and status is not RECEIVED', () => {
  const msg = new Message('id', 'c', 's', new Date(), MessageStatus.SENT);

  expect(() => msg.markAsRead()).toThrow();
});

});
