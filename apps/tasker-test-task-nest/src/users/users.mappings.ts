import { UserDto } from '@tasker-test-task-nest/shared';
import { User } from './user.model';

export function mapUserToDto(user: User): UserDto {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
