import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Task } from './task.model';

@Table
export class ObserversToTasks extends Model<
  InferAttributes<ObserversToTasks>,
  InferCreationAttributes<ObserversToTasks>
> {
    @ForeignKey(() => User)
    @Column
    observerId: number;
  
    @ForeignKey(() => Task)
    @Column
    taskId: number;
}
