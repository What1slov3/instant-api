import mongoose, { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InternalServerErrorException, BadRequestException } from '@nestjs/common/exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InviteDTO } from './dto/invite.dto';
import { InviteModel } from './invites.model';
import { ChannelModel } from '../channels/channel.model';
import { ChannelDTO } from '../channels/dto';
import { UserModel } from '../users/user.model';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(InviteModel.name) private readonly inviteModel: Model<InviteModel>,
    @InjectModel(ChannelModel.name) private readonly channelModel: Model<ChannelModel>,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  public async getLink(channelId: Types.ObjectId) {
    let link = await this.inviteModel.findOne({ channelId });

    if (link) {
      return new InviteDTO(link.toJSON()).get();
    }

    const createdLink = await this.createLink(channelId);

    if (createdLink) {
      return new InviteDTO(createdLink.toJSON()).get();
    }

    throw new InternalServerErrorException();
  }

  public async recreateLink(channelId: Types.ObjectId) {
    const createdLink = this.createLink(channelId);

    if (createdLink) {
      return new InviteDTO(createdLink).get();
    }

    throw new InternalServerErrorException();
  }

  public async createLink(channelId: Types.ObjectId) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const createdLink = await this.inviteModel.create([{ channelId }], { session });

      await session.commitTransaction();
      await session.endSession();

      return createdLink[0];
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  public async getChannelFromInvite(inviteId: string) {
    const link = await this.inviteModel.findById(inviteId);

    if (link) {
      const channel = await this.channelModel.findById(link.channelId);
      if (channel) {
        return new ChannelDTO(channel.toJSON()).getFromInvite();
      }
    }

    return new BadRequestException();
  }

  public async joinChannelByInvite(inviteId: string, userId: Types.ObjectId) {
    const link = await this.inviteModel.findById(inviteId);

    if (link) {
      const session = await this.connection.startSession();
      try {
        session.startTransaction();

        const transactionResult = await Promise.all([
          this.channelModel.findOneAndUpdate(
            { _id: link.channelId },
            { $addToSet: { members: userId } },
            { new: true, session },
          ),
          this.userModel.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { channels: link.channelId } },
            { new: true, session },
          ),
        ]);

        await session.commitTransaction();
        await session.endSession();

        return new ChannelDTO(transactionResult[0].toJSON()).get();
      } catch (e) {
        await session.abortTransaction();
        await session.endSession();
        throw new InternalServerErrorException(e);
      }
    }

    return new BadRequestException();
  }
}
