import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

export class BillDetailsResponse {
  @Expose()
  readonly id: number;

  @Expose()
  readonly quantity: number;

  @Expose()
  readonly description: string;

  @Expose()
  readonly unitPrice: number;

  @Expose()
  readonly taxableSales: number;

  @Expose()
  readonly productId: number;

  @Expose()
  readonly billId: number;

  @Exclude()
  readonly exemptSales: number;

  @Exclude()
  readonly nonTaxableSales: number;

  @ApiHideProperty()
  @Exclude()
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
