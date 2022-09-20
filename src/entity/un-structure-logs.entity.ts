import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'unstructure_jobs_log' })
export class UnstructureLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ingestion_datetime' })
  ingestionDatetime: Date;

  @Column({ name: 'src_folder' })
  srcFolder: string;

  @Column({ name: 'total_src_file' })
  totalSrcFile: number;

  @Column({ name: 'tgt_folder' })
  tgtFolder: string;

  @Column({ name: 'total_file_loaded' })
  totalFileLoaded: number;

  @Column({ name: 'status' })
  status: string;
}
