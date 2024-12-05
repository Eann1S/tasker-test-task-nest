import {
  JwtDto,
  LoginDto,
  RegisterDto,
  UserDto,
} from '@tasker-test-task-nest/shared';
import axios from 'axios';
import { headers } from '../common.test.utils';

export async function registerUser(dto: RegisterDto) {
  return axios.post<UserDto>(`/auth/register`, dto, { headers });
}

export async function loginUser(dto: LoginDto) {
  return axios.post<JwtDto>(`/auth/login`, dto, { headers });
}
