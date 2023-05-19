import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { useRequestLogging } from './middlewares/request_logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
   app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
   useRequestLogging(app);
  await app.listen(3000);
}
bootstrap();
