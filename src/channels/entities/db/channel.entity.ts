import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  OneToOne,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import IChannel from 'channels/interface/channel.interface';
import { UserEntity } from 'users/entities/db/user.entity';
import { ChatEntity } from 'chats/entities/db/chat.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'channel' })
export class ChannelEntity implements IChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column('varchar')
  icon: string;

  @Column({ type: 'varchar', default: '#7a5af8' })
  banner: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => UserEntity, { cascade: ['remove'] })
  @JoinColumn()
  owner: string;

  @OneToOne(() => ChatEntity, (chat) => chat.id)
  @JoinColumn()
  systemChat: string;

  // NULL while creating new channel and main system chat is not created
  // or chats not exist
  @Column({ type: 'uuid', nullable: true })
  systemChatId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
