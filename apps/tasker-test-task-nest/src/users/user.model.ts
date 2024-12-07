import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  HasMany,
  Index,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { Task } from '../tasks/task.model';
import { ObserversToTasks } from '../tasks/observers.tasks';
import { Comment } from '../comments/comment.model';

@Table
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @AllowNull(false)
  @Index
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => Task, 'authorId')
  tasks: Task[];

  @HasMany(() => Task, 'assigneeId')
  assignedTasks: Task[];

  @BelongsToMany(() => Task, () => ObserversToTasks)
  observedTasks: Array<Task & { ObserversToTasks: ObserversToTasks }>;

  @HasMany(() => Comment, 'authorId')
  comments: Comment[];
}
