import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { CreateMessageUseCase } from '@/application/message/use-cases/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/message/use-cases/get-message-by-id.usecase';
import { GetMessagesBySenderUseCase } from '@/application/message/use-cases/get-messages-by-sender.usecase';
import { GetMessagesByPeriodUseCase } from '@/application/message/use-cases/get-messages-by-period.usecase';
import { MESSAGE_REPOSITORY } from '@/application/message/ports/message-repository.token';
import { InMemoryMessageRepository } from '@/infrastructure/message/in-memory-message.repository';
import { UpdateMessageStatusUseCase } from '@/application/message/use-cases/update-message-status.usecase';

@Module({
  controllers: [MessageController],
  providers: [
    InMemoryMessageRepository,
    {
      provide: MESSAGE_REPOSITORY,
      useExisting: InMemoryMessageRepository,
    },
    CreateMessageUseCase,
    GetMessageByIdUseCase,
    GetMessagesBySenderUseCase,
    GetMessagesByPeriodUseCase,
    UpdateMessageStatusUseCase,
  ],
})
export class MessageModule {}
