import { PartialType, PickType } from "@nestjs/swagger";
import { CommentDto } from "./comment.dto";

export class CreateCommentDto extends PartialType(PickType(CommentDto, ['content'] as const)) {}