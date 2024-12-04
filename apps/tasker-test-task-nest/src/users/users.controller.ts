import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserDto } from '@tasker-test-task-nest/shared';

@Controller('users')
export class UsersController {
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return authenticated user profile',
    type: UserDto,
  })
  @Get('/me')
  async getProfile(@Req() req: { user: UserDto }) {
    return req.user;
  }
}
