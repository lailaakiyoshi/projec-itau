import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { HttpLoggingInterceptor } from './shared/interceptors/http-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      exceptionFactory: (errors) => {
        const details = errors.flatMap((e) => {
          const constraints = e.constraints ? Object.values(e.constraints) : [];
          return constraints.map((msg) => `${e.property}: ${msg}`);
        });

        return new BadRequestException({
          error: 'Bad Request',
          message: 'Validation failed',
          details,
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  await app.listen(port);

  console.log(
    JSON.stringify({
      level: 'info',
      msg: 'API started',
      port,
      timestamp: new Date().toISOString(),
    }),
  );
}

bootstrap();
