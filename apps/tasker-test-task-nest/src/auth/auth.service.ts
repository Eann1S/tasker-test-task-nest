import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import {
  JwtDto,
  JwtPayload,
  LoginDto,
  RegisterDto,
  UserDto,
} from '@tasker-test-task-nest/shared';
import * as argon from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<UserDto> {
    const userExists = await this.usersService.existsWithEmail(dto.email);
    if (userExists) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`
      );
    }
    const hashedPassword = await argon.hash(dto.password);
    const user = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });
    const userDto = await this.mapUserToDto(user);
    return userDto;
  }

  async login(dto: LoginDto): Promise<JwtDto> {
    const user = await this.usersService.getUserByEmail(dto.email);
    const isPasswordValid = await argon.verify(user.password, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userDto = await this.mapUserToDto(user);
    const accessToken = await this.jwtService.signAsync({
      sub: userDto.id,
      user: userDto,
    });
    return { accessToken };
  }

  async verifyToken(
    token: string | undefined | null
  ): Promise<JwtPayload | never> {
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      Logger.error(error);
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async mapUserToDto(user: User): Promise<UserDto> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }
}
