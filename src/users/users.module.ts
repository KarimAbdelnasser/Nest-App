import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({ secret: config.jwt }),
  ],
  exports: [UsersService],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
})
export class UserModule {}
