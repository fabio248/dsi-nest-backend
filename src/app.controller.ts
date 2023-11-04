import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Monitoring')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Health',
    description: 'Use this endpoint to check the health of the API',
  })
  @Get()
  root(): { status: string; uptime: number } {
    return { status: 'ok', uptime: process.uptime() };
  }
}
