import { InviteModel, InviteSchema } from './invites.model';
import { Module } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModel, ChannelSchema } from 'src/channels/channel.model';
import { UserModel, UserSchema } from 'src/users/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: InviteModel.name, schema: InviteSchema }]),
    MongooseModule.forFeature([{ name: ChannelModel.name, schema: ChannelSchema }]),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [InvitesService],
  controllers: [InvitesController],
})
export class InvitesModule {}
