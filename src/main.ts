import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import IUser from './users/interfaces/user.interface';

export const VERSION = '0.2.0';

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
      MAX_FILE_UPLOAD: string;
      TYPEORM_HOST: string;
      TYPEORM_PASSWORD: string;
      TYPEORM_USERNAME: string;
      TYPEORM_DATABASE: string;
      TYPEORM_PORT: string;
      BASE_CHAT_NAME: string;
      BASE_CHAT_GROUP_NAME: string;
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
