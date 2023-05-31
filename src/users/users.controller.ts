import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/generate_user')
  async createUser(@Body() newUser: CreateUserDto): Promise<User> {
    return this.userService.createUser(newUser);
  }

  @Post('/login')
  login(@Body() newUser: CreateUserDto) {
    return this.userService.login(newUser);
  }

  @Get('/list_users')
  listUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get('/list_user/:id')
  listUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/delete_user/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/update_user/:id')
  update_user(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto) {
    return this.userService.updateUser(id, user)
  }
}
