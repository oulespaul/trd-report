import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class StampReportDto {
  @Type(() => Date)
  @IsDate()
  ingestionDatetime: Date;

  srcFolder: string;

  totalSrcFile: number;

  tgtFolder: string;

  totalFileLoaded: number;

  status: string;
}
