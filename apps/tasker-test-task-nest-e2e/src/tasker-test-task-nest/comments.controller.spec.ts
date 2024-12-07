import { addComment, addRandomComment, deleteComment } from './utils/comments/comments.utils';
import { generateCommentData } from './utils/common.test.utils';
import { createRandomTask } from './utils/tasks/tasks.utils';

describe('Comments Controller', () => {
  describe('POST /comments', () => {
    it('should add comment', async () => {
      const { accessToken, task } = await createRandomTask();
      const dto = generateCommentData();

      const res = await addComment(accessToken, task.id, dto);

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        id: expect.any(Number),
        content: dto.content,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should not add comment if task does not exist', async () => {
        const { accessToken } = await createRandomTask();
        const dto = generateCommentData();
  
        const res = await addComment(accessToken, 1231, dto);
  
        expect(res.status).toBe(500);
        expect(res.data).toMatchObject({
          message: `Could not add comment`,
        });
    });
  });

  describe('DELETE /comments', () => {
    it('should delete comment', async () => {
      const { accessToken, comment } = await addRandomComment();

      const res = await deleteComment(accessToken, comment.id);

      expect(res.status).toBe(200);
    });

    it('should not delete comment if it does not exist', async () => {
        const { accessToken } = await addRandomComment();
  
        const res = await deleteComment(accessToken, 1231);
  
        expect(res.status).toBe(404);
        expect(res.data).toMatchObject({
          message: `Comment not found`,
        });
    });
  });
});
