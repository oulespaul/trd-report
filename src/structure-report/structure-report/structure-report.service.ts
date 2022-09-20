import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsLog } from 'src/entity/structure-logs.entity';
import { Between, Repository } from 'typeorm';
import * as json2csv from 'json2csv';
import { Workbook } from 'exceljs';
import dayjs from 'dayjs';

@Injectable()
export class StructureReportService {
  constructor(
    @InjectRepository(JobsLog) private jobLogsRepository: Repository<JobsLog>,
  ) {}

  getAll(startDate: string, endDate: string) {
    return this.jobLogsRepository.find({
      where: {
        startTime: Between(new Date(startDate), new Date(endDate)),
      },
    });
  }

  generateReportCsvOrText(data: any[]) {
    const parser = new json2csv.Parser({
      fields: [
        'execKey',
        'jobId',
        'jobStatus',
        'startTime',
        'endTime',
        'scrDb',
        'scrTable',
        'scrRows',
        'tgtDb',
        'tgtTable',
        'insertedRows',
      ],
    });

    return parser.parse(data);
  }

  generateXlsx(data: any[]) {
    const book = new Workbook();
    const rows = [];

    data.forEach((item) => {
      rows.push(Object.values(item));
    });

    const sheet = book.addWorksheet('report');

    rows.unshift(Object.keys(data[0]));

    sheet.addRows(rows);

    return book.xlsx.writeBuffer();
  }
}
