import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDto } from '../user/user.dto';
import { TaskStatus } from './task.status';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CommentDto } from '../comment/comment.dto';

export class TaskDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiPropertyOptional({ enum: TaskStatus })
  status?: TaskStatus;

  @ApiProperty()
  author?: UserDto;

  @ApiProperty()
  assignee?: UserDto;

  @ApiProperty()
  observers?: UserDto[];

  @ApiProperty()
  comments?: CommentDto[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
