import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import {PrismaService} from "../database/database.service";
import {User} from "@prisma/client";
import {StrategicReport, TacticalReport} from "./interfaces";
import {Response} from "express";

export type TemplatePath = 'strategic.template.hbs' | 'tactical.template.hbs';

@Injectable()
export class PdfGeneratesService {
    constructor(private readonly prismaService: PrismaService) {}

    async strategicGenerate(res: Response, user: User) {
        console.log(user)
        const products = await this.prismaService.product.findMany({
            where: {
                createdAt: {
                    lte: new Date(),
                }
            }
        });

        console.log('products', products);

        return;
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
            temPath,
        );;
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);

        return template(data);
    }
}
