import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtLogin: JwtService
  ) { }

  async createUser(user: CreateUserDto) {
    const password = user.password;
    const planeToHash = await hash(password, 10);
    user = { ...user, password: planeToHash }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async login(user: CreateUserDto) {
    const username = user.username;
    const findUser = await this.userRepository.findOne({
      where: {
        username: username
      }
    });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);

    const checkPassword = await compare(user.password, findUser.password);

    if (!checkPassword) throw new HttpException('INCORRECT_PASSWORD', 403);

    const payload = { id: findUser.id_login, username: findUser.username }
    const token = await this.jwtLogin.sign(payload)

    const data = {
      user: findUser,
      token: token
    }
    return data
  }

  getUsers() {
    return this.userRepository.find()
  }

  getUser(id: number) {
    return this.userRepository.findOne({
      where: {
        id_login: id
      }
    })
  }

  deleteUser(id: number) {
    return this.userRepository.delete({
      id_login: id
    })
  }

  updateUser(id: number, user: UpdateUserDto) {
    return this.userRepository.update({ id_login: id }, user);
  }
}
