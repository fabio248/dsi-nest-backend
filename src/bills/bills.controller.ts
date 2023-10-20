import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { BillsService } from './services/bills.service';
import { CreateBillInput } from './dto/input/create-bill.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { BillResponse } from './dto/response/bill.response';
import { GenericWithSearchArgs } from '../shared/args/generic-with-search.args';
import { FindAllBillsResponse } from './dto/response/find-all-bills.response';

@ApiTags('Bills')
@UseGuards(RoleGuard(UserRole.ADMIN))
@ApiBearerAuth()
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  create(@Body() createBillDto: CreateBillInput): Promise<BillResponse> {
    console.log({ createBillDto });
    return this.billsService.create(createBillDto);
  }

  @Get()
  findAll(
    @Query() args?: GenericWithSearchArgs,
  ): Promise<FindAllBillsResponse> {
    return this.billsService.findAll(args);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BillResponse> {
    return this.billsService.findOne(+id);
  }
}
