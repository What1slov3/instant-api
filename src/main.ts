import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import IUser from './users/interfaces/user.interface';
import * as cookieParser from 'cookie-parser';

export const VERSION = '0.1.0';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'dev' | 'production';
      URI: string;
      PORT: string;
      URL: string;
      DEV_URL: string;
      DB_URI: string;
      UPLOAD_LOCATION: string;
      MAX_FILE_SIZE: string;
      JWT_SECRET: string;
      JWT_SECRET_REFRESH: string;
      STATIC_URL: string;
      APP_NAME: string;
      JWT_ACCESS_EXPIRED: string;
      JWT_REFRESH_EXPIRED: string;
      INVITE_LINK_LENGTH: string;
      LOCAL_FRONT_URL: string;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Instant API')
    .setDescription('Documentation for Instant API')
    .setVersion(VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: ['127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT);

  console.log(`Server is running at ${process.env.PORT}`);
}
bootstrap();
