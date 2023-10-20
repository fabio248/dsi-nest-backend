import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/database.service';
import { CreateBillDetailsInput } from '../dto/input/create-bill-details.input';
import { ProductNotFoundException } from '../../products/exception/product-not-found.exception';
import { Prisma } from '@prisma/client';
import { addMany, dineroUSD } from '../utils/dinero.utils';
import { multiply, toDecimal, Dinero } from 'dinero.js';

@Injectable()
export class BillsDetailsService {
  create() {
    return 'This action adds a new bill';
  }

  async createMany(
    prisma: PrismaService,
    createBillsDetailsInput: CreateBillDetailsInput[],
    billId: number,
  ): Promise<{ totalSales: number }> {
    const subTotals: Dinero<number>[] = [];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: createBillsDetailsInput.map((item) => item.productId),
        },
      },
    });

    const input = createBillsDetailsInput.map(
      (item): Prisma.BillDetailUncheckedCreateInput => {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (!product) {
          throw new ProductNotFoundException(item.productId);
        }

        console.log({ product });
        const price = dineroUSD(product.sellingProduct * 100);
        const taxablesales = multiply(price, item.quantity);
        subTotals.push(taxablesales);

        return {
          quantity: item.quantity,
          description: product.nameProduct,
          billId,
          productId: item.productId,
          unitPrice: product.sellingProduct,
          taxableSales: +toDecimal(taxablesales),
        };
      },
    );

    const totalSales = addMany(subTotals);

    await prisma.billDetail.createMany({
      data: input,
    });

    return { totalSales: +toDecimal(totalSales) };
  }
  findOne(id: number) {
    return `This action returns a #${id} bill`;
  }
}
