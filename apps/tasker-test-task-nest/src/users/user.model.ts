import { InferAttributes, InferCreationAttributes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  Model,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @AllowNull(false)
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
}
