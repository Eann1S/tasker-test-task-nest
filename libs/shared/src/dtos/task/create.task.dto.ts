import { ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { TaskDto } from "./task.dto";
import { IsOptional } from "class-validator";

export class CreateTaskDto extends PickType(TaskDto, ['title', 'description', 'status'] as const) {
    @IsOptional()
    @ApiPropertyOptional()
    assigneeId?: number;
}