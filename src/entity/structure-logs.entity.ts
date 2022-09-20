import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'jobs_log' })
export class JobsLog {
  @PrimaryGeneratedColumn({ name: 'exec_key' })
  execKey: number;

  @Column({ name: 'job_id' })
  jobId: number;

  @Column({ name: 'job_status' })
  jobStatus: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'scr_db' })
  scrDb: string;

  @Column({ name: 'scr_table' })
  scrTable: string;

  @Column({ name: 'scr_rows' })
  scrRows: number;

  @Column({ name: 'tgt_db' })
  tgtDb: string;

  @Column({ name: 'tgt_table' })
  tgtTable: string;

  @Column({ name: 'inserted_rows' })
  insertedRows: number;
}
