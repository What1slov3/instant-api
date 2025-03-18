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
import { ChannelEntity } from 'channels/entities/db';
import type { IUser } from 'users/interfaces';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'channelPermission' })
export class ChannelPermissionEntity implements IPermission, DBTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: IUser['id'];
  
  @ManyToOne(() => UserEntity, (user) => user.id, { cascade: ['remove'] })
  @JoinColumn()
  user: IUser['id'];

  @Index()
  @Column('uuid')
  contextId: UUID;
  
  @ManyToOne(() => ChannelEntity, (channel) => channel.id, { cascade: ['remove'] })
  @JoinColumn()
  context: UUID;

  @Column({ type: 'integer', default: 0 })
  rule: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
