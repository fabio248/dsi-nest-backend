import { Injectable, Logger } from '@nestjs/common';
import { CreateBillInput } from '../dto/input/create-bill.input';
import { BillsDetailsService } from './bills-details.service';
import { PrismaService } from '../../database/database.service';
import { plainToInstance } from 'class-transformer';
import { BillResponse } from '../dto/response/bill.response';

@Injectable()
export class BillsService {
  private logger = new Logger(BillsService.name);
  constructor(
    private readonly billsDetailsService: BillsDetailsService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createBillDto: CreateBillInput) {
    this.logger.log('Create bill, input:', createBillDto);
    const bill = await this.prisma.$transaction(
      async (prisma: PrismaService) => {
        const bill = await prisma.bill.create({
          data: {
            client: {
              connect: {
                id: createBillDto.clientId,
              },
            },
            totalSales: 0,
          },
        });

        const { totalSales } = await this.billsDetailsService.createMany(
          prisma,
          createBillDto.billsDetails,
          bill.id,
        );

        return prisma.bill.update({
          where: {
            id: bill.id,
          },
          data: {
            totalSales,
          },
          include: {
            client: true,
            billsDetails: true,
          },
        });
      },
    );

    return plainToInstance(BillResponse, bill);
  }

  findAll() {
    return `This action returns all bills`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }
}
