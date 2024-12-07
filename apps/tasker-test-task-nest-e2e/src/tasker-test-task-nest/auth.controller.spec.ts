import { loginUser, registerUser } from './utils/auth/auth.utils';
import { generateUserData } from './utils/common.test.utils';
import {
  CreateUserDto,
  LoginDto,
  RegisterDto,
} from '@tasker-test-task-nest/shared';

describe('Auth Controller', () => {
  let userData: CreateUserDto;

  beforeEach(async () => {
    userData = generateUserData();
  });

  describe('POST /register', () => {
    it('should register', async () => {
      const dto: RegisterDto = { ...userData };

      const res = await registerUser(dto);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        id: expect.any(Number),
        email: dto.email,
        username: dto.username,
      });
    });

    it('should not register when user already exist', async () => {
      const dto: RegisterDto = { ...userData };
      await registerUser(dto);

      const res = await registerUser(dto);

      expect(res.status).toBe(409);
      expect(res.data).toMatchObject({
        message: `User with email ${dto.email} already exists`,
      });
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await registerUser({ ...userData });
    });

    it('should login', async () => {
      const dto: LoginDto = { ...userData };

      const res = await loginUser(dto);

      expect(res.status).toBe(200);
      expect(res.data).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('should not login when user does not exist', async () => {
      const dto: LoginDto = { ...userData };

      const res = await loginUser({
        email: `invalid123${dto.email}`,
        password: dto.password,
      });

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: `User with email invalid123${dto.email} not found`,
      });
    });

    it('should not login when password is invalid', async () => {
      const dto: LoginDto = { ...userData };

      const res = await loginUser({ email: dto.email, password: 'invalid' });

      expect(res.status).toBe(401);
      expect(res.data).toMatchObject({
        message: `Invalid credentials`,
      });
    });
  });
});
