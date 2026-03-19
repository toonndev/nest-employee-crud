import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './department.entity';

@Entity('employee')
export class EmpRecord {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  EmpNum: string;

  @Column({ type: 'varchar', length: 100 })
  EmpName: string;

  @Column({ type: 'date' })
  HireDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Salary: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Position: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  DepNo: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  HeadNo: string;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'DepNo' })
  department: Department;
}
