import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('employee_backup')
export class EmployeeBackup {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  EmpNum: string;

  @Column({ type: 'varchar', length: 100 })
  EmpName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Salary: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Position: string;
}
