import { RefreshTokenModel, RefreshTokenDocument } from './models/refreshToken.model';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import * as argon2 from 'argon2';
import { TRefreshTokenPayload } from './auth.types';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshTokenModel.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (user && (await argon2.verify(user.passwordHash, password))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async createTokensPair(userId: string | Types.ObjectId) {
    return {
      access: this.createAccessToken(userId),
      refresh: await this.createRefreshToken(userId),
    };
  }

  createAccessToken(userId: string | Types.ObjectId) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRED,
      },
    );
  }

  async createRefreshToken(userId: string | Types.ObjectId) {
    await this.refreshTokenModel.deleteOne({ sub: userId });

    const refreshToken = (await this.refreshTokenModel.create({ sub: userId })).toJSON();

    return this.jwtService.sign(
      { id: refreshToken._id, sub: userId },
      {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: process.env.JWT_REFRESH_EXPIRED,
      },
    );
  }

  async matchRefreshToken(token: string) {
    try {
      if (
        this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET_REFRESH,
        })
      ) {
        const decodedToken = this.jwtService.decode(token) as TRefreshTokenPayload;
        return await this.refreshTokenModel.findOne({
          _id: new Types.ObjectId(decodedToken.id),
          sub: decodedToken.sub,
        });
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
