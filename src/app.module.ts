import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChannelsModule } from './channels/channels.module';
import { FilesModule } from './files/files.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { InvitesModule } from './invites/invites.module';
import { GatewaysModule } from './gateways/gateways.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: 'instant',
      retryAttempts: 5,
      retryDelay: 1000,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      port: Number(process.env.TYPEORM_PORT),
      entities: [__dirname + 'dist/**/db/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      logging: true,
      synchronize: true,
    }),
    MulterModule.register({
      dest: './',
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    ChannelsModule,
    FilesModule,
    ChatsModule,
    MessagesModule,
    InvitesModule,
    GatewaysModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
