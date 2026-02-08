import { Message } from './message.entity';
import { MessageStatus } from './message-status.enum';

describe('Message Entity', () => {
  it('should update status', () => {
    const msg = new Message(
      'id-1',
      'conteudo',
      'laila',
      new Date(),
      MessageStatus.SENT,
    );

    msg.updateStatus(MessageStatus.READ);

    expect(msg.status).toBe(MessageStatus.READ);
  });
});

