import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CommentDto,
  CreateCommentDto,
  JwtPayload,
} from '@tasker-test-task-nest/shared';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Creates a new comment',
    type: CommentDto,
  })
  @ApiParam({ name: 'taskId', type: 'number' })
  @Post(':taskId')
  async addComment(
    @Param('taskId') taskId: number,
    @Body() dto: CreateCommentDto,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.commentsService.addComment(req.payload.user.id, taskId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Deletes a comment',
  })
  @ApiParam({ name: 'commentId', type: 'number' })
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Req() req: { payload: JwtPayload }
  ) {
    return this.commentsService.deleteComment(req.payload.user.id, commentId);
  }
}
