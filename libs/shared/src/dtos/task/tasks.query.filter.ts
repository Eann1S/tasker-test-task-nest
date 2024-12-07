import { ApiPropertyOptional } from "@nestjs/swagger";
import { TaskStatus } from "./task.status";
import { IsEnum, IsOptional } from "class-validator";

export class TasksQueryFilter {
    @IsOptional()
    @IsEnum(TaskStatus)
    @ApiPropertyOptional({enum: TaskStatus})
    status?: TaskStatus;
}