import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { UserModel, UserDocument } from './user.model';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  public async createUser(body: CreateUserDTO) {
    if (await this.userModel.findOne({ email: body.email })) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.userModel.create({
      ...body,
      passwordHash: await argon2.hash(body.password),
    });

    return new UserDTO(createdUser.toJSON()).getPublic();
  }

  public async findOne(
    query:
      | {
          [key in keyof Pick<UserDTO, 'email' | 'username'>]?: string;
        }
      | { _id: Types.ObjectId },
  ) {
    const user = await this.userModel.findOne(query);
    return user ? user.toJSON() : null;
  }

  public async getUsers(ids: Types.ObjectId[]) {
    return (await this.userModel.find({ _id: ids })).map((user) => new UserDTO(user.toJSON()).getPublic());
  }

  public async changePassword(currentPassword: string, newPassword: string, userId: Types.ObjectId) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const user = await this.userModel.findById(userId);

      if (!(await argon2.verify(user.passwordHash, currentPassword))) {
        throw new BadRequestException('Неверный пароль');
      }

      const newHash = await argon2.hash(newPassword);

      await this.userModel.updateOne({ _id: userId }, { passwordHash: newHash });

      await session.commitTransaction();
      await session.endSession();
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }

  async updateUser(updatingFields: UpdateUserDTO, userId: Types.ObjectId) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const user = await this.userModel.findOneAndUpdate({ _id: userId }, updatingFields, {
        session,
        new: true,
      });

      await session.commitTransaction();
      await session.endSession();

      return new UserDTO(user.toJSON()).getMe();
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      throw new InternalServerErrorException(e);
    }
  }
}
