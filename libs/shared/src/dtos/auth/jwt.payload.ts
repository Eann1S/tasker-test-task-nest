import { UserDto } from '../user/user.dto';

export class JwtPayload {
  sub!: number;
  user!: UserDto;
  exp!: Date;
  iat!: Date;
}
