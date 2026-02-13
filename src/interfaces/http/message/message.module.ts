import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';

import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';

import { MESSAGE_REPOSITORY } from '@/application/message/ports/message-repository.token';
import { MessageDynamoRepository } from '../../../infrastructure/repositories/message-dynamo.repository';

@Module({
  controllers: [MessageController],
  providers: [
    MessageDynamoRepository,

    {
      provide: MESSAGE_REPOSITORY,
      useExisting: MessageDynamoRepository,
    },

    CreateMessageUseCase,
    GetMessageByIdUseCase,
    GetMessagesBySenderUseCase,
    GetMessagesByPeriodUseCase,
    UpdateMessageStatusUseCase,
  ],
  exports: [MESSAGE_REPOSITORY],
})
export class MessageModule {}
