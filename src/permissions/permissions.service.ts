import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EPermissions } from 'permissions/permissions';
import { PermissionsDocument, PermissionsModel } from './permissions.model';
import { SetPermissionsDTO } from './dto/setPermission.dto';
import { PermissionsDTO } from './dto/permissions.dto';
import type { TPermissionContext } from './types';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(PermissionsModel.name) private readonly permissionsModel: Model<PermissionsDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async setPermissions(data: SetPermissionsDTO) {
    let { permissions, context, contextId, userId } = data;

    permissions = typeof permissions === 'number' ? permissions : EPermissions[permissions];

    const updatedPermission = await this.permissionsModel.findOneAndUpdate(
      {
        userId,
      },
      [
        {
          $set: {
            [context]: {
              $cond: [
                { $in: [contextId, `$${context}.contextId`] },
                {
                  $map: {
                    input: `$${context}`,
                    in: {
                      $cond: [
                        { $eq: [`$$this.contextId`, contextId] },
                        {
                          contextId: `$$this.contextId`,
                          permissions: permissions,
                        },
                        '$$this',
                      ],
                    },
                  },
                },
                { $concatArrays: [`$${context}`, [{ contextId, permissions }]] },
              ],
            },
          },
        },
      ],
    );

    if (!updatedPermission) {
      await this.permissionsModel.create({
        userId,
        [context]: [{ contextId, permissions }],
      });
    }
  }

  public async getPermissions(context: TPermissionContext, contextId: string, userId: string) {
    const query = `${context}.contextId`;

    const contextPermissions = await this.permissionsModel.aggregate([
      { $unwind: `$${context}` },
      { $match: { [query]: contextId, userId } },
      {
        $project: {
          _id: 0,
          userId: 1,
          [context]: 1,
        },
      },
    ]);

    // this.setPermissions(new PermissionsDTO({userId, context, contextId }).getSetterData())

    return contextPermissions[0];
  }
}
