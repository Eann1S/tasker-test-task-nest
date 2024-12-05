import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from '@tasker-test-task-nest/shared';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(dto: CreateUserDto) {
    try {
      return await this.userModel.create({
        email: dto.email,
        username: dto.username,
        password: dto.password,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getUserById(id: number) {
    try {
      return await this.userModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userModel.findOne({
        where: { email },
        rejectOnEmpty: true,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  async existsWithEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return !!user;
  }
}
