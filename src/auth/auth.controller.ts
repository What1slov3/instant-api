import { Controller, Get, HttpCode, Post, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from './dto/response/login.dto';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Аутентификация и авторизация пользователя' })
  @ApiOkResponse({ type: LoginDTO })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Express.Request, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.createTokensPair(req.user._id);
    res.cookie('refresh', tokens.refresh, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    return {
      access: tokens.access,
      user: req.user._id,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получения пользователя по токену' })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Обновление пары токенов' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        access: {
          type: 'string',
        },
      },
    },
  })
  @Get('refresh')
  async refreshTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refresh = await this.authService.matchRefreshToken(req.cookies.refresh);
    if (refresh) {
      const tokens = await this.authService.createTokensPair(refresh.sub);
      res.cookie('refresh', tokens.refresh, { httpOnly: true });
      return {
        access: tokens.access,
      };
    }
    throw new UnauthorizedException();
  }

  @ApiOperation({ summary: 'Разлогинивание пользователя, удаление токенов' })
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh');
    return;
  }
}
