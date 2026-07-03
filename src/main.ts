import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const PORT = config.getOrThrow<string>('APP_PORT');

  await app.listen(PORT);
}
bootstrap().catch((e) => console.error(e));
