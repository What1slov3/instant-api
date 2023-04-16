import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import IUser from '../interfaces/user.interface';

class UpdatebleUserFields implements Partial<IUser> {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ required: true })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @ApiProperty({ required: true })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  avatar?: string;
}

export class UpdateUserDTO extends PartialType(UpdatebleUserFields) {}
