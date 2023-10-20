import { PaginationResponse } from '../../../shared/args/pagination.response';
import { BillResponse } from './bill.response';

export class FindAllBillsResponse extends PaginationResponse {
  data: BillResponse[];
}
