import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IChatGroup } from 'chats/interfaces/chatGroup.interface';
import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { ChatEntity } from './chat.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'chatGroup' })
export class ChatGroupEntity implements IChatGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Index()
  @Column('uuid')
  owningChannelId: string;

  @ManyToOne(() => ChannelEntity, { cascade: ['remove'] })
  @JoinColumn()
  owningChannel: string;

  @OneToMany(() => ChatEntity, (chat) => chat.chatGroup)
  chats: ChatEntity[] | string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
