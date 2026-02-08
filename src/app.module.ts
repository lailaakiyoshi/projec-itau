import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './infrastructure/auth/auth.module';
import { HealthModule } from './interfaces/http/health/health.module';
import { MessageModule } from './interfaces/http/message/message.module';
import { RequestIdMiddleware } from './shared/middlewares/request-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HealthModule,
    MessageModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
