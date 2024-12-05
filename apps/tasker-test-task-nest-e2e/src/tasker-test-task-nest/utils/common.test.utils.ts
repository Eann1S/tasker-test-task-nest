import { faker } from '@faker-js/faker';

export const headers = {
  'Content-Type': 'application/json',
};

export function getHeadersWithAuth(accessToken: string) {
  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

export function generateUserData() {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  };
}
