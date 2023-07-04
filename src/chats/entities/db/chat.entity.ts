import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import IChat from 'chats/interfaces/chat.interface';
import { ChatGroupEntity } from './chatGroup.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'chat' })
export class ChatEntity implements IChat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @ManyToOne(() => ChatGroupEntity, (chatGroup) => chatGroup.chats, { cascade: ['remove'] })
  chatGroup: ChatGroupEntity;

  @Index()
  @Column('uuid')
  chatGroupId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
