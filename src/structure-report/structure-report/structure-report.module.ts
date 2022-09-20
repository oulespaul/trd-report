import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsLog } from 'src/entity/structure-logs.entity';
import { StructureReportController } from './structure-report.controller';
import { StructureReportService } from './structure-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobsLog])],
  controllers: [StructureReportController],
  providers: [StructureReportService],
})
export class StructureReportModule {}
