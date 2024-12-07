import { createRandomUser, getProfile } from './utils/users/users.utils';

describe('Users Controller', () => {
  describe('GET /me', () => {
    it('should return profile of authenticated user', async () => {
      const {user, accessToken} = await createRandomUser();

      const res = await getProfile(accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: user.id,
        email: user.email,
        username: user.username,
      });
    });

    it('should not return profile when token is invalid', async () => {
      await createRandomUser();

      const res = await getProfile('invalid');

      expect(res.status).toBe(401);
      expect(res.data).toMatchObject({
        message: `Invalid token`
      });
    });

    it('should not return profile when token is missing', async () => {
      await createRandomUser();

      const res = await getProfile('');

      expect(res.status).toBe(401);
      expect(res.data).toMatchObject({
        message: `Token is missing`
      });
    });
  });
});
