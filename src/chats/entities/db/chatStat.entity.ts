import { IChatStat } from 'chats/interfaces/chatStat.interface';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'chatStat' })
export class ChatStatEntity implements IChatStat {
  @PrimaryColumn()
  @OneToOne(() => ChatEntity, (chat) => chat.id)
  @JoinColumn()
  chatId: string;

  @Column({ type: 'int', default: 0 })
  messageCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
