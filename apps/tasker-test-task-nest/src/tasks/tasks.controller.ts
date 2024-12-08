import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  JwtPayload,
  TaskDto,
  TasksQueryFilter,
  TaskStatus,
  UpdateTaskDto,
} from '@tasker-test-task-nest/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Creates a new task',
    type: TaskDto,
  })
  @Post()
  async createTask(
    @Body() dto: CreateTaskDto,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.createTask(req.payload.user.id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Updates a task by ID, returns updated task',
    type: TaskDto,
  })
  @ApiForbiddenResponse({ description: 'User is not author of task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: number,
    @Body() dto: UpdateTaskDto,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.updateTask(req.payload.user.id, taskId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Updates a task status by ID, returns updated task',
    type: TaskDto,
  })
  @ApiForbiddenResponse({
    description: 'User is not assignee or author of task',
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @ApiQuery({ name: 'status', enum: TaskStatus })
  @Put(':taskId/status')
  async updateTaskStatus(
    @Param('taskId') taskId: number,
    @Query('status') status: TaskStatus,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.updateTaskStatus(
      req.payload.user.id,
      taskId,
      status
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Deletes a task by ID',
  })
  @ApiForbiddenResponse({ description: 'User is not author of task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @Delete(':taskId')
  async deleteTask(
    @Param('taskId') taskId: number,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.deleteTask(req.payload.user.id, taskId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Assigns a user to a task',
  })
  @ApiForbiddenResponse({ description: 'User is not author of task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @ApiParam({ name: 'assigneeId', type: 'number' })
  @Post(':taskId/assign/:assigneeId')
  async assignUserToTask(
    @Param('taskId') taskId: number,
    @Param('assigneeId') assigneeId: number,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.assignUserToTask(
      req.payload.user.id,
      taskId,
      assigneeId
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Adds an observer to a task',
  })
  @ApiForbiddenResponse({ description: 'User is not author of task' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @ApiParam({ name: 'observerId', type: 'number' })
  @Post(':taskId/observe/:observerId')
  async addObserverToTask(
    @Param('taskId') taskId: number,
    @Param('observerId') observerId: number,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.tasksService.addObserverToTask(
      req.payload.user.id,
      taskId,
      observerId
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns all tasks',
    type: [TaskDto],
  })
  @Get()
  async getTasks(@Query() filter: TasksQueryFilter) {
    return this.tasksService.getTasks(filter);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Returns all tasks for authenticated user where he is assignee',
    type: [TaskDto],
  })
  @Get('assigned')
  async getTasksWhereUserAssignee(@Req() req: { payload: JwtPayload }) {
    return this.tasksService.getTasksByAssigneeId(req.payload.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Returns all tasks for authenticated user where he is observer',
    type: [TaskDto],
  })
  @Get('observing')
  async getTasksWhereUserObserver(@Req() req: { payload: JwtPayload }) {
    return this.tasksService.getTasksByObserverId(req.payload.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns a task by ID',
    type: TaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiParam({ name: 'taskId', type: 'number' })
  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: number) {
    return this.tasksService.getTaskDtoById(taskId);
  }
}
