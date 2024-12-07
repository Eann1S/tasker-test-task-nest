import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { ObserversToTasks } from './observers.tasks';
import { TaskStatus } from '@tasker-test-task-nest/shared';
import { Comment } from '../comments/comment.model';

@Table
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  @AllowNull(false)
  @Column
  title: string;

  @Column
  description: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @Default(TaskStatus.todo)
  @Column(DataType.ENUM(...Object.values(TaskStatus)))
  status: TaskStatus;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @BelongsTo(() => User, 'authorId')
  author: User;

  @ForeignKey(() => User)
  @Column
  assigneeId: number;

  @BelongsTo(() => User, 'assigneeId')
  assignee: User;

  @BelongsToMany(() => User, () => ObserversToTasks)
  observers: Array<User & { ObserversToTasks: ObserversToTasks }>;

  @HasMany(() => Comment, 'taskId')
  comments: Comment[];
}
