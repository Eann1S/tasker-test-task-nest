import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { CommentDto, CreateCommentDto } from '@tasker-test-task-nest/shared';
import { mapCommentToDto } from './comments.mappings';
import { Includeable, InferAttributes, WhereOptions } from 'sequelize';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

  async addComment(
    authorId: number,
    taskId: number,
    dto: CreateCommentDto
  ): Promise<CommentDto> {
    const { content } = dto;
    try {
      const { id } = await this.commentModel.create({
        authorId,
        taskId,
        content,
      });
      const comment = await this.findComment({ id }, [{ all: true }]);
      return mapCommentToDto(comment);
    } catch (e) {
      Logger.error(e);
      throw new InternalServerErrorException(`Could not add comment`);
    }
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.findComment({ id: commentId });
    this.checkThatUserIsAuthor(userId, comment);
    await comment.destroy();
  }

  async findComment(
    where: WhereOptions<InferAttributes<Comment>>,
    include?: Includeable | Includeable[]
  ) {
    try {
      return await this.commentModel.findOne({
        where,
        include,
        rejectOnEmpty: true,
      });
    } catch (e) {
      Logger.error(e);
      throw new NotFoundException(`Comment not found`);
    }
  }

  private checkThatUserIsAuthor(authorId: number, comment: Comment) {
    if (authorId !== comment.authorId) {
      throw new ForbiddenException(`You are not the author of this comment`);
    }
  }
}
