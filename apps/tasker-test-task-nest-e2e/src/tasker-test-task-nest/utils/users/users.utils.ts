import axios from 'axios';
import {
  generateUserData,
  getHeadersWithAuth,
} from '../common.test.utils';
import { loginUser, registerUser } from '../auth/auth.utils';
import { UserDto } from '@tasker-test-task-nest/shared';

export async function createRandomUser() {
  const dto = generateUserData();
  const { data: user } = await registerUser(dto);
  const { data } = await loginUser(dto);

  return {
    user: {
      ...user,
      password: dto.password,
    },
    accessToken: data.accessToken,
  };
}

export async function getProfile(accessToken: string) {
  return axios.get<UserDto>('/users/me', {
    headers: getHeadersWithAuth(accessToken),
  });
}
