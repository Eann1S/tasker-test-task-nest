import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Task } from '../tasks/task.model';

@Table
export class Comment extends Model<
  InferAttributes<Comment>,
  InferCreationAttributes<Comment>
> {
    @Column
    content: string;

    @ForeignKey(() => User)
    @Column
    authorId: number;

    @BelongsTo(() => User, 'authorId')
    author: User;

    @ForeignKey(() => Task)
    @Column
    taskId: number;

    @BelongsTo(() => Task, 'taskId')
    task: Task;
}
