import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SetPermissionsDTO } from './dto/setPermission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { ChannelPermissionEntity, ChatPermissionEntity } from './entities/db';
import { EPermissionContext } from './permissions.const';
import type { UUID } from 'common';
import { PermissionsDTO } from './dto/permissions.dto';


@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(ChatPermissionEntity) private readonly chatPermissionRepository: Repository<ChatPermissionEntity>,
    @InjectRepository(ChannelPermissionEntity)
    private readonly channelPermissionRepository: Repository<ChannelPermissionEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    
  }

  public async setPermissions(data: SetPermissionsDTO): Promise<void> {
    const repository = data.context === EPermissionContext.CHAT ? this.chatPermissionRepository : this.channelPermissionRepository;
    const permission = repository.create({ rule: data.rule, userId: data.userId, contextId: data.contextId });
    repository.save(permission);
  }

  public async getPermissions(
    context: EPermissionContext,
    contextId: UUID,
    userId: UUID,
  ): Promise<ReturnType<PermissionsDTO['get']>> {
    const repository = context === EPermissionContext.CHAT ? this.chatPermissionRepository : this.channelPermissionRepository;

    const result = await repository.findOne({ where: { userId, contextId } });

    return new PermissionsDTO(result).get();
  }
}
