import { generateTaskData } from './utils/common.test.utils';
import {
  addObserverToTask,
  assignUserToTask,
  createRandomTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTasksForAssignee,
  getTasksWhereUserObserver,
  updateTask,
  updateTaskStatus,
} from './utils/tasks/tasks.utils';
import { createRandomUser } from './utils/users/users.utils';

describe('Tasks Controller', () => {
  describe('POST /tasks', () => {
    it('should create task', async () => {
      const { user, accessToken } = await createRandomUser();
      const dto = generateTaskData();

      const res = await createTask(accessToken, dto);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        id: expect.any(Number),
        title: dto.title,
        description: dto.description,
        status: dto.status,
        author: { id: user.id },
      });
    });

    it('should create task with assignee', async () => {
      const { user, accessToken } = await createRandomUser();
      const { user: assignee } = await createRandomUser();
      const dto = generateTaskData(assignee.id);

      const res = await createTask(accessToken, dto);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        id: expect.any(Number),
        title: dto.title,
        description: dto.description,
        status: dto.status,
        author: { id: user.id },
        assignee: { id: assignee.id },
      });
    });

    it('should not create task when assignee does not exist', async () => {
      const { accessToken } = await createRandomUser();
      const dto = generateTaskData(123123);

      const res = await createTask(accessToken, dto);

      expect(res.status).toBe(500);
      expect(res.data).toMatchObject({
        message: `Could not create task`,
      });
    });
  });

  describe('PUT /tasks/:taskId', () => {
    it('should update task', async () => {
      const { accessToken, task } = await createRandomTask();
      const dto = generateTaskData();

      const res = await updateTask(accessToken, task.id, dto);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: task.id,
        title: dto.title,
        description: dto.description,
        status: dto.status,
      });
    });

    it('should not update task when user is not author', async () => {
      const { task } = await createRandomTask();
      const { accessToken } = await createRandomUser();
      const dto = generateTaskData();

      const res = await updateTask(accessToken, task.id, dto);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `You are not author of task`,
      });
    });
  });

  describe('PUT /tasks/:taskId/status', () => {
    it('should update task status', async () => {
      const { accessToken, task } = await createRandomTask();
      const { status } = generateTaskData();

      const res = await updateTaskStatus(accessToken, task.id, status);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: task.id,
        status: status,
      });
    });

    it('should update task status when assigned', async () => {
      const { user: assignee, accessToken } = await createRandomUser();
      const { task } = await createRandomTask(assignee.id);
      const { status } = generateTaskData();

      const res = await updateTaskStatus(accessToken, task.id, status);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: task.id,
        status: status,
      });
    });

    it('should not update task status when not author or assignee', async () => {
      const { task } = await createRandomTask();
      const { accessToken } = await createRandomUser();
      const { status } = generateTaskData();

      const res = await updateTaskStatus(accessToken, task.id, status);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `You are not assignee or author of task`,
      });
    });
  });

  describe('DELETE /tasks/:taskId', () => {
    it('should delete task', async () => {
      const { accessToken, task } = await createRandomTask();

      const res = await deleteTask(accessToken, task.id);

      expect(res.status).toBe(200);
    });

    it('should not delete task when user is not author', async () => {
      const { task } = await createRandomTask();
      const { accessToken } = await createRandomUser();

      const res = await deleteTask(accessToken, task.id);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `You are not author of task`,
      });
    });
  });

  describe('POST /tasks/:taskId/assign/:assigneeId', () => {
    it('should assign task', async () => {
      const { accessToken, task } = await createRandomTask();
      const { user: assignee } = await createRandomUser();

      const res = await assignUserToTask(accessToken, task.id, assignee.id);

      expect(res.status).toBe(200);
    });

    it('should not assign task when user is not author', async () => {
      const { user, task } = await createRandomTask();
      const { accessToken } = await createRandomUser();

      const res = await assignUserToTask(accessToken, task.id, user.id);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `You are not author of task`,
      });
    });
  });

  describe('POST /tasks/:taskId/observe/:observerId', () => {
    it('should add observer to task', async () => {
      const { accessToken, task } = await createRandomTask();
      const { user: observer } = await createRandomUser();

      const res = await addObserverToTask(accessToken, task.id, observer.id);

      expect(res.status).toBe(200);
    });

    it('should not add observer to task when user is not author', async () => {
      const { user, task } = await createRandomTask();
      const { accessToken } = await createRandomUser();

      const res = await addObserverToTask(accessToken, task.id, user.id);

      expect(res.status).toBe(403);
      expect(res.data).toMatchObject({
        message: `You are not author of task`,
      });
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      const { accessToken, task } = await createRandomTask();

      const res = await getTasks(accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });

    it('should return all tasks by status', async () => {
      const { accessToken, task } = await createRandomTask();

      const res = await getTasks(accessToken, { status: task.status });

      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });
  });

  describe('GET /tasks/assigned', () => {
    it('should return tasks where user is assignee', async () => {
      const { accessToken, user: assignee } = await createRandomUser();
      const { task } = await createRandomTask(assignee.id);

      const res = await getTasksForAssignee(accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });
  });

  describe('GET /tasks/observing', () => {
    it('should return tasks where user is observer', async () => {
      const { accessToken, user: observer } = await createRandomUser();
      const { accessToken: authorAccessToken, task } = await createRandomTask();
      await addObserverToTask(authorAccessToken, task.id, observer.id);

      const res = await getTasksWhereUserObserver(accessToken);

      expect(res.status).toBe(200);
      expect(res.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: task.id })])
      );
    });
  });

  describe('GET /tasks/:taskId', () => {
    it('should return task by id', async () => {
      const { user: assignee } = await createRandomUser();
      const { accessToken, task, user: author, } = await createRandomTask(assignee.id);

      const res = await getTaskById(accessToken, task.id);

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        author: { id: author.id },
        assignee: { id: assignee?.id },
        observers: task.observers?.map((observer) => ({ id: observer.id })),
        comments: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should not return task by id when it does not exist', async () => {
      const { accessToken } = await createRandomTask();

      const res = await getTaskById(accessToken, 123123);

      expect(res.status).toBe(404);
      expect(res.data).toMatchObject({
        message: `Task not found`,
      });
    });
  });
});
