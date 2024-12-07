import { CommentDto } from '@tasker-test-task-nest/shared';
import { Comment } from './comment.model';

export function mapCommentToDto(comment: Comment): CommentDto {
  if (!comment) {
    return null;
  }
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
