// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { UnStructureReportService } from './un-structure-report.service';
import { ApiExcludeEndpoint, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UnstructureLogs } from 'src/entity/un-structure-logs.entity';
import { StampReportDto } from './dto/stamp-report.dto';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit-table';
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
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${fileName}`,
    });

    const logs = await this.unStructureReportService.getAll(startDate, endDate);

    const tableArray = {
      headers: [
        {
          label: 'IngestionDatetime',
          property: 'ingestionDatetime',
          width: 95,
          renderer: (value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          label: 'SrcFolder',
          property: 'srcFolder',
          width: 95,
          renderer: null,
        },
        {
          label: 'TotalSrcFile',
          property: 'totalSrcFile',
          width: 95,
          renderer: null,
        },
        {
          label: 'TgtFolder',
          property: 'tgtFolder',
          width: 95,
          renderer: null,
        },
        {
          label: 'TotalFileLoaded',
          property: 'totalFileLoaded',
          width: 95,
          renderer: null,
        },
        {
          label: 'Status',
          property: 'status',
          width: 95,
          renderer: null,
        },
      ],
      datas: logs.map((item) => ({
        ...item,
        ingestionDatetime: item.ingestionDatetime.toString(),
      })),
    };

    doc.table(tableArray, { width: 580 });

    doc.pipe(res);

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
