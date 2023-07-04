import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EPermissions } from 'permissions/permissions';
import { PermissionsContext } from './interfaces/permission.interface';
import { PermissionsDocument, PermissionsModel } from './permissions.model';
import { SetPermissionsDTO } from './dto/setPermission.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(PermissionsModel.name) private readonly permissionsModel: Model<PermissionsDocument>) {}

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

  public async getPermissions(context: PermissionsContext, contextId: string, userId: string) {
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

    return contextPermissions[0];
  }
}
