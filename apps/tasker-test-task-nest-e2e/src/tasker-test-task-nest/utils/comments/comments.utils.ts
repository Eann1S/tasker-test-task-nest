import { CommentDto, CreateCommentDto } from '@tasker-test-task-nest/shared';
import axios from 'axios';
import { generateCommentData, getHeadersWithAuth } from '../common.test.utils';
import { createRandomTask } from '../tasks/tasks.utils';

export async function addComment(accessToken: string, taskId: number, dto: CreateCommentDto) {
  return axios.post<CommentDto>(`/comments/${taskId}`, dto, {
    headers: getHeadersWithAuth(accessToken),
  });
}

export async function addRandomComment() {
  const {user, accessToken, task} = await createRandomTask();
  const dto = generateCommentData();
  const {data: comment} = await addComment(accessToken, task.id, dto);
  return {user, accessToken, task, comment};
}

export async function deleteComment(accessToken: string, commentId: number) {
  return axios.delete<void>(`/comments/${commentId}`, {
    headers: getHeadersWithAuth(accessToken),
  });
}
