import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import {
  CreateTaskDto,
  TaskDto,
  TasksQueryFilter,
  TaskStatus,
  UpdateTaskDto,
} from '@tasker-test-task-nest/shared';
import { mapTaskToDto } from './tasks.mappings';
import { Includeable, InferAttributes, WhereOptions } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task
  ) {}

  async createTask(authorId: number, dto: CreateTaskDto): Promise<TaskDto> {
    const { title, description, status, assigneeId } = dto;
    try {
      const { id } = await this.taskModel.create({
        authorId,
        title,
        description,
        status,
        assigneeId,
      });
      const task = await this.findTask({ id }, [{ all: true }]);
      return mapTaskToDto(task);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Could not create task');
    }
  }

  async updateTask(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto
  ): Promise<TaskDto> {
    const { title, description, status } = dto;
    let task = await this.findTask({ id: taskId }, [{ all: true }]);
    this.checkThatUserIsAuthor(userId, task);
    task = await task.update({ title, description, status });
    return mapTaskToDto(task);
  }

  async updateTaskStatus(
    userId: number,
    taskId: number,
    status: TaskStatus
  ): Promise<TaskDto> {
    let task = await this.findTask({ id: taskId }, [
      { association: 'author' },
      { association: 'assignee' },
    ]);
    this.checkThatUserIsAssigneeOrAuthor(userId, task);
    task = await task.update({ status });
    return mapTaskToDto(task);
  }

  async deleteTask(userId: number, taskId: number): Promise<void> {
    const task = await this.findTask({ id: taskId });
    this.checkThatUserIsAuthor(userId, task);
    await task.destroy();
  }

  async assignUserToTask(
    userId: number,
    taskId: number,
    assigneeId: number
  ): Promise<void> {
    const task = await this.findTask({ id: taskId });
    this.checkThatUserIsAuthor(userId, task);
    await task.$set('assignee', [assigneeId]);
  }

  async addObserverToTask(
    userId: number,
    taskId: number,
    observerId: number
  ): Promise<void> {
    const task = await this.findTask({ id: taskId });
    this.checkThatUserIsAuthor(userId, task);
    await task.$add('observers', [observerId]);
  }

  async getTasks(filter?: TasksQueryFilter): Promise<TaskDto[]> {
    const where = this.buildWhereConditions(filter);
    const tasks = await this.taskModel.findAll({
      where,
      include: [{ association: 'author' }, { association: 'comments' }],
    });
    return tasks.map(mapTaskToDto);
  }

  async getTasksByAssigneeId(assigneeId: number): Promise<TaskDto[]> {
    const tasks = await this.taskModel.findAll({
      where: { assigneeId },
      include: [{ all: true }],
    });
    return tasks.map(mapTaskToDto);
  }

  async getTasksByObserverId(observerId: number): Promise<TaskDto[]> {
    const tasks = await this.taskModel.findAll({
      include: [
        {
          association: 'observers',
          where: { id: observerId },
        },
        { association: 'author' },
        { association: 'comments' },
      ],
    });
    return tasks.map(mapTaskToDto);
  }

  async getTaskDtoById(id: number): Promise<TaskDto> {
    const task = await this.findTask({ id }, [{ all: true }]);
    return mapTaskToDto(task);
  }

  async findTask(
    where: WhereOptions<InferAttributes<Task>>,
    include?: Includeable | Includeable[]
  ): Promise<Task> {
    try {
      return await this.taskModel.findOne({
        where,
        rejectOnEmpty: true,
        include,
      });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Task not found`);
    }
  }

  private checkThatUserIsAuthor(userId: number, task: Task) {
    if (task.authorId !== userId) {
      throw new ForbiddenException(`You are not author of task`);
    }
  }

  private checkThatUserIsAssigneeOrAuthor(userId: number, task: Task) {
    if (task.assigneeId !== userId && task.authorId !== userId) {
      throw new ForbiddenException(`You are not assignee or author of task`);
    }
  }

  private buildWhereConditions(filter: TasksQueryFilter) {
    const where: WhereOptions<InferAttributes<Task>> = {};
    if (filter.status) {
      where.status = filter.status;
    }
    return where;
  }
}
