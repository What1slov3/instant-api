import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IRefreshToken } from 'auth/interfaces/refreshToken.interface';
import { UserEntity } from 'users/entities/db/user.entity';
import type { IUser } from 'users/interfaces';

@Entity({ database: process.env.TYPEORM_DATABASE, name: 'refreshToken' })
export class RefreshTokenEntity implements IRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  sub: string;

  @Column('uuid')
  subId: IUser['id'];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
