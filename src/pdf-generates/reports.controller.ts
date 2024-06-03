import {Controller, Get, Res, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {PdfGeneratesService} from "./pdf-generates.service";
import RoleGuard from "../auth/guards/role.guard";
import {UserRole} from "../users/dto/enum/role.enum";
import {CurrentUser} from "../shared/decorator/current-user.decorator";
import {User} from "@prisma/client";
import {Response} from "express";

@ApiTags('Reports Endpoints')
@UseGuards(RoleGuard(UserRole.ADMIN))
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
    constructor(private readonly pdfGeneratesService: PdfGeneratesService) {}

    @Get('strategic')
    async strategicGenerate(@Res() res: Response, @CurrentUser() user: User): Promise<void> {
        return this.pdfGeneratesService.strategicGenerate(res, user);
    }
}
