import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Query,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './dto';
import { GetUsersDTO } from './dto/getUsers.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'common';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Создание нового пользователя' })
  @ApiOkResponse({ type: UserEntity })
  @Post('create')
  async createUser(@Body() body: CreateUserDTO) {
    return this.userService.createUser(body);
  }

  @ApiBearerAuth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse({ type: String })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@Request() req: Express.Request) {
    const user = await this.userService.findOne({ _id: req.user._id });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return new UserDTO(user).getMe();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователей по ID' })
  @ApiOkResponse({ type: [UserEntity] })
  @ApiBadRequestResponse({ type: String })
  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers(@Query() query: GetUsersDTO) {
    return this.userService.getUsers(query.ids);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление пароля пользователя' })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async changePassword(@Body() body: ChangePasswordDTO, @Request() req: Express.Request) {
    return this.userService.changePassword(body.currentPassword, body.newPassword, req.user._id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], multerOptions))
  @Patch('update')
  async updateUser(@Body() body: UpdateUserDTO, @UploadedFiles() files, @Request() req: Express.Request) {
    return this.userService.updateUser({ ...body, avatar: files?.avatar?.[0].filename }, req.user._id);
  }
}
