import { Types } from "mongoose"

export type GatewayChannelKickUserPayload = {
  userId: string | Types.ObjectId;
  channelId: string | Types.ObjectId;
}