import { faker } from '@faker-js/faker';
import { CreateCommentDto, CreateTaskDto, CreateUserDto, TaskStatus } from '@tasker-test-task-nest/shared';

export const headers = {
  'Content-Type': 'application/json',
};

export function getHeadersWithAuth(accessToken: string) {
  return {
    ...headers,
    Authorization: `Bearer ${accessToken}`,
  };
}

export function generateUserData(): CreateUserDto {
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: faker.internet.password(),
  };
}

export function generateTaskData(assigneeId?: number): CreateTaskDto {
  return {
    title: faker.string.sample(),
    description: faker.string.sample(),
    status: faker.helpers.enumValue(TaskStatus),
    assigneeId,
  };
}

export function generateCommentData(): CreateCommentDto {
  return {
    content: faker.string.sample(),
  };
}
