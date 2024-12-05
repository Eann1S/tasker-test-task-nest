import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtPayload, UserDto } from '@tasker-test-task-nest/shared';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Return authenticated user profile',
    type: UserDto,
  })
  @Get('/me')
  async getProfile(@Req() req: { payload: JwtPayload }) {
    return req.payload.user;
  }
}
