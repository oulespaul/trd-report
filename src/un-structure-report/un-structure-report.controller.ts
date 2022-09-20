import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { UnStructureReportService } from './un-structure-report.service';
import { ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UnstructureLogs } from 'src/entity/un-structure-logs.entity';
import { StampReportDto } from './dto/stamp-report.dto';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as dayjs from 'dayjs';

@Controller('un-structure-report')
@ApiTags('un-structure-report')
export class UnStructureReportController {
  constructor(private unStructureReportService: UnStructureReportService) {}

  @Get()
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2022-09-09 10:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2022-09-15 10:00:00',
  })
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<UnstructureLogs[]> {
    return this.unStructureReportService.getAll(startDate, endDate);
  }

  @Post('stamp-report')
  @ApiExcludeEndpoint()
  create(@Body() stampReport: StampReportDto): Promise<UnstructureLogs> {
    return this.unStructureReportService.create(stampReport);
  }

  @Get('/generate-report/txt')
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2022-09-09 10:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2022-09-15 10:00:00',
  })
  async generateFileTXT(
    @Res() res: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const dateFormat = dayjs(new Date(startDate)).format('YYYYMMDD');
    const fileName = `un_structure_report_${dateFormat}.txt`;
    const logs = await this.unStructureReportService.getAll(startDate, endDate);

    const reportFile =
      this.unStructureReportService.generateReportCsvOrText(logs);

    res.header('Content-Type', 'text/txt');
    res.attachment(fileName);
    return res.send(reportFile);
  }

  @Get('/generate-report/csv')
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2022-09-09 10:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2022-09-15 10:00:00',
  })
  async generateFileCSV(
    @Res() res: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const dateFormat = dayjs(new Date(startDate)).format('YYYYMMDD');
    const fileName = `un_structure_report_${dateFormat}.csv`;
    const logs = await this.unStructureReportService.getAll(startDate, endDate);

    const reportFile =
      this.unStructureReportService.generateReportCsvOrText(logs);

    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(reportFile);
  }

  @Get('/generate-report/pdf')
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2022-09-09 10:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2022-09-15 10:00:00',
  })
  async generateFilePDF(
    @Res() res: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const dateFormat = dayjs(new Date(startDate)).format('YYYYMMDD');
    const fileName = `un_structure_report_${dateFormat}.pdf`;
    const doc = new PDFDocument({ bufferPages: true });
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${fileName}`,
    });
    doc.on('data', (chunk) => stream.write(chunk));
    doc.on('end', () => stream.end());

    const logs = await this.unStructureReportService.getAll(startDate, endDate);

    logs.map((log) => {
      return doc.font('Times-Roman').fontSize(12).text(JSON.stringify(log));
    });

    doc.end();
  }

  @Get('/generate-report/xlsx')
  @ApiQuery({
    name: 'startDate',
    required: true,
    type: String,
    example: '2022-09-09 10:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    type: String,
    example: '2022-09-15 10:00:00',
  })
  async generateFileXLSX(
    @Res() res: Response,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const dateFormat = dayjs(new Date(startDate)).format('YYYYMMDD');
    const fileName = `un_structure_report_${dateFormat}.xlsx`;
    const logs = await this.unStructureReportService.getAll(startDate, endDate);

    const reportFile = await this.unStructureReportService.generateXlsx(logs);

    res.header('Content-disposition', `attachment; filename=${fileName}`);
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    return res.send(reportFile);
  }
}
