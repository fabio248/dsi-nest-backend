import { PartialType } from '@nestjs/swagger';
import { CreateBillInput } from './create-bill.input';

export class UpdateBillDto extends PartialType(CreateBillInput) {}
