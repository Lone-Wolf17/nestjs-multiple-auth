import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { useRequestLogging } from './middlewares/request_logging.middleware';
import { ValidationPipe } from '@nestjs/common';
import EnvVars from './constants/EnvVars';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  useRequestLogging(app);
  await app.listen(EnvVars.Port);
}
bootstrap();
