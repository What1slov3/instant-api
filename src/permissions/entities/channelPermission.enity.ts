import { IPermission } from 'permissions/interfaces';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'users/entities/db/user.entity';
import { DBTimestamps, UUID } from 'common';
import { ChannelEntity } from 'channels/entities/db/channel.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'channelPermission' })
export class ChannelPermissionEntity implements IPermission, DBTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => UserEntity, (user) => user.id, { cascade: ['remove'] })
  @JoinColumn()
  userId: UUID;

  @Index()
  @ManyToOne(() => ChannelEntity, (channel) => channel.id, { cascade: ['remove'] })
  @JoinColumn()
  contextId: UUID;

  @Column({ type: 'integer', default: 0 })
  rule: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
