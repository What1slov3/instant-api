import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { UserDTO } from '../../users/dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne({ _id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    return new UserDTO(user).getMe();
  }
}
