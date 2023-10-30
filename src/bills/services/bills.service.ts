import { Injectable, Logger } from '@nestjs/common';
import { CreateBillInput } from '../dto/input/create-bill.input';
import { BillsDetailsService } from './bills-details.service';
import { PrismaService } from '../../database/database.service';
import { plainToInstance } from 'class-transformer';
import { BillResponse } from '../dto/response/bill.response';
import { BillNotFoundException } from '../exception/bill-not-found.exception';
import { GenericWithSearchArgs } from '../../shared/args/generic-with-search.args';
import { getPaginationParams } from '../../shared/helper/pagination-params.helper';
import { FindAllBillsResponse } from '../dto/response/find-all-bills.response';

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

    return plainToInstance(BillResponse, bill, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(args: GenericWithSearchArgs): Promise<FindAllBillsResponse> {
    this.logger.log('Retrieve all bills');
    const { page, limit } = args;

    const [bills, totalItems] = await Promise.all([
      this.prisma.bill.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          client: true,
          billsDetails: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.prisma.bill.count(),
    ]);

    const paginationParams = getPaginationParams(totalItems, page, limit);

    return {
      data: plainToInstance(BillResponse, bills, {
        excludeExtraneousValues: true,
      }),
      ...paginationParams,
    };
  }

  async findOne(id: number): Promise<BillResponse> {
    this.logger.log('Retrieve bill');
    const bill = await this.prisma.bill.findUnique({
      where: { id },
      include: {
        client: true,
        billsDetails: true,
      },
    });

    if (!bill) {
      throw new BillNotFoundException(id);
    }

    return plainToInstance(BillResponse, bill, {
      excludeExtraneousValues: true,
    });
  }
}
