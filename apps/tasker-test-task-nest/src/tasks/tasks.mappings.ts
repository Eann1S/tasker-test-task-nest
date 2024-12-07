import { TaskDto } from '@tasker-test-task-nest/shared';
import { Task } from './task.model';
import { mapUserToDto } from '../users/users.mappings';
import { mapCommentToDto } from '../comments/comments.mappings';

export function mapTaskToDto(task: Task): TaskDto {
  if (!task) {
    return null;
  }
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    author: mapUserToDto(task.author),
    assignee: mapUserToDto(task.assignee),
    observers: task.observers?.map(mapUserToDto),
    comments: task.comments?.map(mapCommentToDto),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}
