import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/input/create-file.input';
import { ApiTags } from '@nestjs/swagger';
import { GenericArgs } from '../shared/args/generic.args';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post(':petId')
  create(@Body() createFileDto: CreateFileDto, @Param('petId') petId: number) {
    return this.filesService.create(createFileDto, petId);
  }

  @Get()
  findAll(@Query() args?: GenericArgs) {
    return this.filesService.findAll(args);
  }

  @Get(':fileId')
  findOne(@Param('fileId') fileId: number) {
    return this.filesService.findOne(fileId);
  }
}
