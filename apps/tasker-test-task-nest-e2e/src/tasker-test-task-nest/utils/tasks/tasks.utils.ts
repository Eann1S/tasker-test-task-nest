import {
  CreateTaskDto,
  TaskDto,
  TasksQueryFilter,
  TaskStatus,
  UpdateTaskDto,
} from '@tasker-test-task-nest/shared';
import axios from 'axios';
import { generateTaskData, getHeadersWithAuth } from '../common.test.utils';
import { createRandomUser } from '../users/users.utils';

export async function createTask(accessToken: string, dto: CreateTaskDto) {
  return axios.post<TaskDto>('/tasks', dto, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function createRandomTask(assigneeId?: number) {
  const { user, accessToken } = await createRandomUser();
  const dto: CreateTaskDto = generateTaskData(assigneeId);
  const { data: task } = await createTask(accessToken, dto);
  return { task, user, accessToken };
}

export async function updateTask(
  accessToken: string,
  taskId: number,
  dto: UpdateTaskDto
) {
  return axios.put<TaskDto>(`tasks/${taskId}`, dto, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function updateTaskStatus(
  accessToken: string,
  taskId: number,
  status: TaskStatus
) {
  return axios.put<TaskDto>(
    `tasks/${taskId}/status`,
    {},
    {
      params: { status },
      headers: getHeadersWithAuth(accessToken),
    }
  );
}

export async function deleteTask(accessToken: string, taskId: number) {
  return axios.delete<void>(`tasks/${taskId}`, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function assignUserToTask(
  accessToken: string,
  taskId: number,
  assigneeId: number
) {
  return axios.post<void>(
    `tasks/${taskId}/assign/${assigneeId}`,
    {},
    {
      headers: getHeadersWithAuth(accessToken),
    }
  );
}

export async function addObserverToTask(
  accessToken: string,
  taskId: number,
  observerId: number
) {
  return axios.post<void>(
    `tasks/${taskId}/observe/${observerId}`,
    {},
    {
      headers: getHeadersWithAuth(accessToken),
    }
  );
}

export async function getTasks(accessToken: string, filter?: TasksQueryFilter) {
  return axios.get<[TaskDto]>(`tasks`, {
    headers: getHeadersWithAuth(accessToken),
    params: { filter },
  });
}

export async function getTasksForAssignee(accessToken: string) {
  return axios.get<[TaskDto]>(`tasks/assigned`, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function getTasksWhereUserAssignee(accessToken: string) {
  return axios.get<[TaskDto]>(`tasks/assigned`, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function getTasksWhereUserObserver(accessToken: string) {
  return axios.get<[TaskDto]>(`tasks/observing`, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function getTaskById(accessToken: string, taskId: number) {
  return axios.get<TaskDto>(`tasks/${taskId}`, {
    headers: getHeadersWithAuth(accessToken),
  });
}
