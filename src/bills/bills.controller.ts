import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { BillsService } from './services/bills.service';
import { CreateBillInput } from './dto/input/create-bill.input';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from '../auth/guards/role.guard';
import { UserRole } from '../users/dto/enum/role.enum';
import { BillResponse } from './dto/response/bill.response';

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
  findAll() {
    return this.billsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billsService.findOne(+id);
  }
}
