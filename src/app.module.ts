import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructureReportModule } from './structure-report/structure-report/structure-report.module';
import { UnStructureReportModule } from './un-structure-report/un-structure-report.module';
import * as dotenv from "dotenv"
dotenv.config()

console.log(process.env.DATABASE_HOST)
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
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
