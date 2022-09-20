import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobsLog } from 'src/entity/structure-logs.entity';
import { StructureReportService } from './structure-report.service';
import * as PDFDocument from 'pdfkit';
import * as dayjs from 'dayjs';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('structure-report')
@ApiTags('structure-report')
export class StructureReportController {
  constructor(private structureReportService: StructureReportService) {}

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
  ): Promise<JobsLog[]> {
    return this.structureReportService.getAll(startDate, endDate);
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
    const dateFormat = dayjs().format('YYYYMMDD');
    const fileName = `structure_report_${dateFormat}.txt`;
    const logs = await this.structureReportService.getAll(startDate, endDate);

    const reportFile =
      this.structureReportService.generateReportCsvOrText(logs);

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
    const dateFormat = dayjs().format('YYYYMMDD');
    const fileName = `structure_report_${dateFormat}.csv`;
    const logs = await this.structureReportService.getAll(startDate, endDate);

    const reportFile =
      this.structureReportService.generateReportCsvOrText(logs);

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
    const dateFormat = dayjs().format('YYYYMMDD');
    const fileName = `structure_report_${dateFormat}.pdf`;
    const doc = new PDFDocument({ bufferPages: true });
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${fileName}`,
    });
    doc.on('data', (chunk) => stream.write(chunk));
    doc.on('end', () => stream.end());

    const logs = await this.structureReportService.getAll(startDate, endDate);

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
    const dateFormat = dayjs().format('YYYYMMDD');
    const fileName = `structure_report_${dateFormat}.xlsx`;
    const logs = await this.structureReportService.getAll(startDate, endDate);

    const reportFile = await this.structureReportService.generateXlsx(logs);

    res.header('Content-disposition', `attachment; filename=${fileName}`);
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    return res.send(reportFile);
  }
}
