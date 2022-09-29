// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { JobsLog } from 'src/entity/structure-logs.entity';
import { StructureReportService } from './structure-report.service';
import * as PDFDocument from 'pdfkit-table';
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

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment;filename=${fileName}`,
    });

    const logs = await this.structureReportService.getAll(startDate, endDate);

    const tableArray = {
      headers: [
        {
          label: 'ExecKey',
          property: 'execKey',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'JobId',
          property: 'jobId',
          width: 40,
          renderer: null,
          align: 'center',
        },
        {
          label: 'JobStatus',
          property: 'jobStatus',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'StartTime',
          property: 'startTime',
          width: 50,
          renderer: (value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
          },
          align: 'center',
        },
        {
          label: 'EndTime',
          property: 'endTime',
          width: 50,
          renderer: (value) => {
            return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
          },
          align: 'center',
        },
        {
          label: 'ScrDb',
          property: 'scrDb',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'ScrTable',
          property: 'scrTable',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'ScrRows',
          property: 'scrRows',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'TgtDb',
          property: 'tgtDb',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'TgtTable',
          property: 'tgtTable',
          width: 50,
          renderer: null,
          align: 'center',
        },
        {
          label: 'InsertedRows',
          property: 'insertedRows',
          width: 50,
          renderer: null,
          align: 'center',
        },
      ],
      datas: logs.map((item) => ({
        ...item,
        startTime: item?.startTime.toString() || '',
        endTime: item?.endTime.toString() || '',
      })),
    };

    doc.table(tableArray, {
      width: 580,
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        const { x, y, width, height } = rectCell;

        // first line
        if (indexColumn === 0) {
          doc
            .lineWidth(0.2)
            .moveTo(x, y)
            .lineTo(x, y + height)
            .stroke();
        }

        doc
          .lineWidth(0.2)
          .moveTo(x + width, y)
          .lineTo(x + width, y + height)
          .stroke();
      },
    });

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
