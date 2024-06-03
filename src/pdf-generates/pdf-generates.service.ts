import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import {PrismaService} from "../database/database.service";
import {Prisma, User} from "@prisma/client";
import {StrategicReport, TacticalReport, TopProduct} from "./interfaces";
import {Response} from "express";
import {StrategicReportDto} from "./dtos/request/strategic-report.input";
import {format} from "date-fns";

export type TemplatePath = 'strategic.template.hbs' | 'tactical.template.hbs';

@Injectable()
export class PdfGeneratesService {
    constructor(private readonly prisma: PrismaService) {}

    async strategicGenerate(res: Response, user: User, strategicReportDto: StrategicReportDto) {
        console.log(user, strategicReportDto);
        const { startDate, endDate } = strategicReportDto;
        const whereInput: Prisma.BillWhereInput = {};

        if(startDate !== undefined && endDate !== undefined) {
            whereInput.createdAt = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            }
        }

        const bills = await this.prisma.bill.findMany({
            where: whereInput,
            include: {
                billsDetails: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        // Calculate total amount and total products
        let totalAmount = 0;
        let totalProducts = 0;

        const productSales = new Map<number, { productName: string; quantitySold: number; amountSold: number }>();

        bills.forEach(bill => {
            totalAmount += bill.totalSales;

            bill.billsDetails.forEach(detail => {
                totalProducts += detail.quantity;

                const product = detail.product;
                const existingProduct = productSales.get(product.id);

                if (existingProduct) {
                    existingProduct.quantitySold += detail.quantity;
                    existingProduct.amountSold += detail.taxableSales;
                } else {
                    productSales.set(product.id, {
                        productName: product.nameProduct,
                        quantitySold: detail.quantity,
                        amountSold: detail.taxableSales,
                    });
                }
            });
        });

        // Get top 5 products by quantity sold
        const topProducts: TopProduct[] = Array.from(productSales.values())
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5)
            .map(product => ({
                productName: product.productName,
                quantitySold: product.quantitySold,
                amountSold: product.amountSold.toFixed(2), // Format to string with 2 decimal places
            }));

        const report: StrategicReport = {
            startDate: startDate ? format(new Date(startDate), 'dd/MM/yyyy') : null,
            endDate: endDate ? format(new Date(endDate), 'dd/MM/yyyy') : null,
            totalAmount: totalAmount.toFixed(2), // Format to string with 2 decimal places
            totalProducts,
            topProducts,
            currentDate: format(new Date(), 'dd/MM/yyyy'),
        };

        const buffer = await this.generate('strategic.template.hbs', report);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=strategic-report.pdf');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
    }

    async generate(templatePath: TemplatePath, data: StrategicReport | TacticalReport ){
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
        });

        const page = await browser.newPage();

        const content = await this.compile(templatePath, data);

        await page.setContent(content);
        await page.emulateMediaType('screen');

        const buffer = await page.pdf({
            format: 'A4',
            margin: { top: 20, left: 20, bottom: 20, right: 20 },
            printBackground: true,
        });

        await browser.close();

        return buffer;
    }

    async compile(temPath: TemplatePath, data: StrategicReport | TacticalReport ) {
        const templatePath = path.resolve(
            __dirname,
            `templates/${temPath}`,
        );;
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);

        return template(data);
    }
}
