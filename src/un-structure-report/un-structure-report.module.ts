import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnstructureLogs } from 'src/entity/un-structure-logs.entity';
import { UnStructureReportController } from './un-structure-report.controller';
import { UnStructureReportService } from './un-structure-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnstructureLogs])],
  controllers: [UnStructureReportController],
  providers: [UnStructureReportService],
})
export class UnStructureReportModule {}
