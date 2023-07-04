import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { RefreshTokenPayload } from './auth.types';
import { RefreshTokenEntity } from './entities/db/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (user && (await argon2.verify(user.passwordHash, password))) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async createTokensPair(userId: string) {
    return {
      access: this.createAccessToken(userId),
      refresh: await this.createRefreshToken(userId),
    };
  }

  createAccessToken(userId: string) {
    return this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRED,
      },
    );
  }

  async createRefreshToken(userId: string) {
    await this.refreshTokenRepository.delete({ subId: userId });

    const refreshToken = await this.refreshTokenRepository.save({ subId: userId }, { transaction: false });

    return this.jwtService.sign(
      { id: refreshToken.id, subId: userId },
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
        const decodedToken = this.jwtService.decode(token) as RefreshTokenPayload;
        return await this.refreshTokenRepository.findOne({
          where: {
            id: decodedToken.id,
            subId: decodedToken.subId,
          },
        });
      }
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }
}
