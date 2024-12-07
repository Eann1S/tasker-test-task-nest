import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto extends PickType(UserDto, ['email', 'username'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
