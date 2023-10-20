import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/response';
import { ApiHideProperty, OmitType } from '@nestjs/swagger';
import { BillDetailsResponse } from './bills-details.response';

class ClientBillInfo extends OmitType(UserResponseDto, [
  'birthday',
  'createdAt',
  'updatedAt',
  'role',
  'recoveryToken',
]) {}

export class BillResponse {
  @Expose()
  readonly id: number;

  @Expose()
  @Type(() => ClientBillInfo)
  readonly client: ClientBillInfo;

  @Expose()
  @Type(() => BillDetailsResponse)
  readonly billsDetails: BillDetailsResponse[];

  @Expose()
  readonly totalSales: number;

  /**
   * La fecha es retornada en este formato: dd/mm/aaaa
   */
  @Expose()
  @Transform(({ value }) => value.toLocaleDateString('es-SV'))
  readonly createdAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly updatedAt: Date;
}
