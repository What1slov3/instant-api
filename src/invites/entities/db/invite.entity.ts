import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { IInvite } from 'invites/interfaces/invites.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'invite' })
export class InviteEntity implements IInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  channelId: string;

  @OneToOne(() => ChannelEntity, (channel) => channel.id, { cascade: ['remove'] })
  @JoinColumn()
  channel: ChannelEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
