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

    const inputMap = new Map<number, Prisma.BillDetailUncheckedCreateInput>();

    createBillsDetailsInput.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new ProductNotFoundException(item.productId);
      }

      const price = dineroUSD(product.sellingProduct * 100);
      const taxableSales = multiply(price, item.quantity);
      subTotals.push(taxableSales);

      if (inputMap.has(item.productId)) {
        // Product already exists in the input map, update the quantity
        const existingItem = inputMap.get(item.productId);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        }
      } else {
        // Product doesn't exist in the input map, add it
        inputMap.set(item.productId, {
          quantity: item.quantity,
          description: product.nameProduct,
          billId,
          productId: item.productId,
          unitPrice: product.sellingProduct,
          taxableSales: +toDecimal(taxableSales),
        });
      }
    });

    // Convert the map values to an array
    const input = Array.from(inputMap.values());

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
