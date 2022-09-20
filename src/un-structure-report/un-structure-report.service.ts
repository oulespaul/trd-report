import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnstructureLogs } from 'src/entity/un-structure-logs.entity';
import { Between, Repository } from 'typeorm';
import { StampReportDto } from './dto/stamp-report.dto';
import * as json2csv from 'json2csv';
import { Workbook } from 'exceljs';

@Injectable()
export class UnStructureReportService {
  constructor(
    @InjectRepository(UnstructureLogs)
    private unstructureLogRepository: Repository<UnstructureLogs>,
  ) {}

  getAll(startDate: string, endDate: string): Promise<UnstructureLogs[]> {
    return this.unstructureLogRepository.find({
      where: {
        ingestionDatetime: Between(new Date(startDate), new Date(endDate)),
      },
    });
  }

  create(stampReport: StampReportDto): Promise<UnstructureLogs> {
    const reportRecord = this.unstructureLogRepository.create(stampReport);

    return this.unstructureLogRepository.save(reportRecord);
  }

  generateReportCsvOrText(data: any[]) {
    const parser = new json2csv.Parser({
      fields: [
        'ingestionDatetime',
        'srcFolder',
        'totalSrcFile',
        'tgtFolder',
        'totalFileLoaded',
        'status',
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
