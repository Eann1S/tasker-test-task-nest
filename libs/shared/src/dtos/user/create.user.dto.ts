import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {
  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
