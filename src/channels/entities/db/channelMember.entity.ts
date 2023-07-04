import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { IChannelMember } from 'channels/interface/channelMember.interface';
import { UserEntity } from '../../../users/entities/db/user.entity';
import { ChannelEntity } from 'channels/entities/db/channel.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'channelMember' })
export class ChannelMemberEntity implements IChannelMember {
  @PrimaryColumn('uuid')
  userId: string;

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
