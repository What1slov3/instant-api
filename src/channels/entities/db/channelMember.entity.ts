import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IChannelMember } from 'channels/interface/channelMember.interface';
import { UserEntity } from '../../../users/entities/db/user.entity';
import { ChannelEntity } from 'channels/entities/db/channel.entity';
import type { IUser } from 'users/interfaces';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'channelMember' })
export class ChannelMemberEntity implements IChannelMember {
  @PrimaryColumn('uuid')
  userId: IUser['id'];

  @PrimaryColumn('uuid')
  channelId: string;

  @OneToOne(() => UserEntity, (user) => user.id, { cascade: ['update'] })
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => ChannelEntity, (channel) => channel.id, { cascade: ['remove'] })
  @JoinColumn()
  channel: ChannelEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
