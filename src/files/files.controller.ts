import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/input/create-file.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GenericArgs } from '../shared/args/generic.args';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '@prisma/client';

@ApiTags('Files')
@Controller('files')
@UseGuards(RoleGuard(UserRole.admin))
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':petId')
  @ApiBearerAuth()
  create(@Body() createFileDto: CreateFileDto, @Param('petId') petId: number) {
    return this.filesService.create(createFileDto, petId);
  }

  @Get()
  @ApiBearerAuth()
  findAll(@Query() args?: GenericArgs) {
    return this.filesService.findAll(args);
  }

  @Get(':fileId')
  @ApiBearerAuth()
  findOne(@Param('fileId') fileId: number) {
    return this.filesService.findOne(fileId);
  }

  @Delete(':fileId')
  @ApiBearerAuth()
  delete(@Param('fileId') fileId: number) {
    return this.filesService.delete(fileId);
  }
}
