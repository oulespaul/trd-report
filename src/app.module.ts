import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructureReportModule } from './structure-report/structure-report/structure-report.module';
import { UnStructureReportModule } from './un-structure-report/un-structure-report.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      username: 'sa',
      password: 'TodA9g=hkdit0jk',
      database: 'trd-report',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      extra: {
        trustServerCertificate: true,
      },
    }),
    StructureReportModule,
    UnStructureReportModule,
  ],
})
export class AppModule {}
