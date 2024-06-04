import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { PrismaService } from '../../database/database.service';
import { Prisma } from '@prisma/client';
import { StrategicReport, TacticalReport, TopProduct } from '../interfaces';
import { Response } from 'express';
import { ReportInputDto } from '../dtos/request/strategic-report.input';
import { format } from 'date-fns';
import { reportTypes } from '../../../prisma/seeds/seed';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from '../../files/files.service';
import { JwtPayload } from '../../auth/interfaces/jwt.interface';

export type TemplatePath = 'strategic.template.hbs' | 'tactical.template.hbs';

@Injectable()
export class PdfGeneratesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FilesService,
  ) {}

  async strategicGenerate(
    res: Response,
    user: JwtPayload,
    strategicReportDto: ReportInputDto,
  ) {
    const { startDate, endDate } = strategicReportDto;
    const whereInput: Prisma.BillWhereInput = {};

    if (startDate !== undefined && endDate !== undefined) {
      whereInput.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bills = await this.prisma.bill.findMany({
      where: whereInput,
      include: {
        billsDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate total amount and total products
    let totalAmount = 0;
    let totalProducts = 0;

    const productSales = new Map<
      number,
      { productName: string; quantitySold: number; amountSold: number }
    >();

    bills.forEach((bill) => {
      totalAmount += bill.totalSales;

      bill.billsDetails.forEach((detail) => {
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
      .map((product) => ({
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
      currentDate: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
    };

    const buffer = await this.prisma.$transaction(async (tPrisma) => {
      const keyNameFile = `${uuidv4()}-strategic-report.pdf`;

      const [buffer] = await Promise.all([
        this.generate('strategic.template.hbs', report),
        tPrisma.report.create({
          data: {
            startDate,
            endDate,
            reportType: {
              connect: {
                name: reportTypes.STRATEGIC_REPORT.name,
              },
            },
            file: {
              create: {
                type: 'pdf',
                key: keyNameFile,
              },
            },
            user: {
              connect: {
                id: +user.identify,
              },
            },
          },
        }),
      ]);

      await this.fileService.uploadFile(buffer, `reports/${keyNameFile}`);

      return buffer;
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=strategic-report.pdf',
    );
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }


  async tacticalGenerate(res: Response, user: JwtPayload, reportInputDto: ReportInputDto) {
    const { startDate, endDate } = reportInputDto;
    const whereInput: Prisma.AppointmentWhereInput = {};

    if (startDate !== undefined && endDate !== undefined) {
      whereInput.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const appointments = await this.prisma.appointment.findMany({
      where: whereInput,
      include: {
        client: true,
      },
    });

    // Calculating the required data for the report
    const totalAppointments = appointments.length;

    const appointmentTypes = [
      'Consulta General',
      'Cirugía General',
      'Esterilización',
      'Vacunación',
      'Limpieza Dental',
      'Desparazitación'
    ];

    const appointmentsByType = appointmentTypes.map(type => ({
      type,
      count: appointments.filter(appointment => appointment.name === type).length,
    }));

    const weekdaysCount = {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    appointments.forEach(appointment => {
      const dayOfWeek = new Date(appointment.startDate).getDay();
      switch(dayOfWeek) {
        case 0:
          weekdaysCount.sunday++;
          break;
        case 1:
          weekdaysCount.monday++;
          break;
        case 2:
          weekdaysCount.tuesday++;
          break;
        case 3:
          weekdaysCount.wednesday++;
          break;
        case 4:
          weekdaysCount.thursday++;
          break;
        case 5:
          weekdaysCount.friday++;
          break;
        case 6:
          weekdaysCount.saturday++;
          break;
      }
    });

    const reportData: TacticalReport = {
      startDate: startDate ? format(new Date(startDate), 'dd/MM/yyyy') : null,
      endDate: endDate ? format(new Date(endDate), 'dd/MM/yyyy') : null,
      totalAppointments,
      appointmentsByType,
      weekdays: weekdaysCount,
      currentDate: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
    };


    const buffer = await this.prisma.$transaction(async (tPrisma) => {
      const keyNameFile = `${uuidv4()}-tactical-report.pdf`;

      const [buffer] = await Promise.all([
        this.generate('tactical.template.hbs', reportData),
        tPrisma.report.create({
          data: {
            startDate,
            endDate,
            reportType: {
              connect: {
                name: reportTypes.STRATEGIC_REPORT.name,
              },
            },
            file: {
              create: {
                type: 'pdf',
                key: keyNameFile,
              },
            },
            user: {
              connect: {
                id: +user.identify,
              },
            },
          },
        }),
      ]);

      await this.fileService.uploadFile(buffer, `reports/${keyNameFile}`);

      return buffer;
    });


    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=tactical-report.pdf',
    );
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  }


  async generate(
    templatePath: TemplatePath,
    data: StrategicReport | TacticalReport,
  ) {
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
      printBackground: true,
    });

    await browser.close();

    return buffer;
  }

  async compile(temPath: TemplatePath, data: StrategicReport | TacticalReport) {
    const templatePath = path.resolve(path.dirname(__dirname), `templates/${temPath}`);
    const templateHtml = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateHtml);

    return template(data);
  }
}
