import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './interfaces/http/health/health.module';
import { MessageModule } from './interfaces/http/message/message.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HealthModule,
    MessageModule,
  ],
})
export class AppModule {}
