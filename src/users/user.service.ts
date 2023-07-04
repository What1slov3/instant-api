import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './dto';
import { UserEntity } from './entities/db/user.entity';
import { generateTag } from 'common';
import { ChannelMemberEntity } from 'channels/entities/db/channelMember.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ChannelMemberEntity)
    private readonly channelMemberRepository: Repository<ChannelMemberEntity>,
    private dataSource: DataSource,
  ) {}

  public async createUser(body: CreateUserDTO) {
    if (await this.userRepository.findOne({ where: { email: body.email } })) {
      throw new BadRequestException('User already exists');
    }

    const entity = await this.userRepository.save(
      {
        ...body,
        tag: generateTag(),
        passwordHash: await argon2.hash(body.password),
      },
      { transaction: false },
    );

    return entity;
  }

  public async getMe(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const channels = await this.channelMemberRepository.find({ where: { userId }, select: { channelId: true } });
    return { ...user, channels: channels.map((channel) => channel.channelId) };
  }

  public async findOne(
    query:
      | {
          [key in keyof Pick<UserDTO, 'email' | 'username'>]?: string;
        }
      | { id: string },
  ) {
    const entity = await this.userRepository.findOne({ where: query });
    return entity;
  }

  public async getUsers(ids: string[]) {
    return await this.userRepository.find({ where: { id: In(ids) } });
  }

  public async changePassword(currentPassword: string, newPassword: string, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!(await argon2.verify(user.passwordHash, currentPassword))) {
      throw new BadRequestException('Неверный пароль');
    }

    const newHash = await argon2.hash(newPassword);

    await this.userRepository.update({ id: userId }, { passwordHash: newHash });
  }

  public async updateUser(data: UpdateUserDTO, userId: string) {
    const user = await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set(data)
      .where('id = :userId', { userId })
      .returning('*')
      .updateEntity(true)
      .execute();

    return user.raw[0];
  }

  public async getChannelsForUser(userId: string) {
    const channels = await this.channelMemberRepository.find({
      where: {
        userId,
      },
      relations: {
        channel: true,
      },
    });

    return channels.map((channel) => channel.channel);
  }
}
