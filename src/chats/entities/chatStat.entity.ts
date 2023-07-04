import { ApiProperty } from "@nestjs/swagger";
import { IChatStat } from "chats/interfaces/chatStat.interface";

export class ChatStatEntity implements IChatStat {
  @ApiProperty({ description: 'Количество сообщений в чате' })
  messageCount: number;

  @ApiProperty({description: 'ID чата-владельца'})
  chatId: string;

  createdAt: Date;
  updatedAt: Date;
}
