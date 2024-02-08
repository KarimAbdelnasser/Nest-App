import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Res() res) {
    const { user, token } = await this.usersService.create(
      body.email,
      body.password,
    );

    res.header('auth-token', token).json({
      message: `User created successfully with ID "${user.id}" and email "${user.email}"`,
    });
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Res() res) {
    const { user, token } = await this.usersService.signin(
      body.email,
      body.password,
    );

    res.header('auth-token', token).json({
      message: `${user.id} You have signed in successfully.`,
    });
  }

  @Patch('/update')
  async updateUser(@Req() req, @Body() body: UpdateUserDto, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    await this.usersService.update(userId, body);

    return res.json({
      message: `Your data updated successfully`,
    });
  }

  @Delete('/unsubscribe')
  async removeUser(@Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const deletedUser = await this.usersService.remove(userId);

    res.json({
      message: `${deletedUser.fullName || deletedUser.email} We're sad to see you go! Your account has been deleted successfully`,
    });
  }

  @Get('/getAll')
  async getAllUsers(@Res() res) {
    const allUsers = await this.usersService.getAllUsers();

    return res.json({
      message: 'Successfully fetched all users',
      data: allUsers,
    });
  }

  @Delete('/remove/:id')
  async removeOne(@Param('id') id: string, @Res() res) {
    const pannedUser = await this.usersService.removeOne(id);
    return res.json({
      ' message': `User ${pannedUser.fullName || pannedUser.email} removed successfully`,
    });
  }
}
