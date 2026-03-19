import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { EmpRecord } from './emp-record.entity';

@Entity('departments')
export class Department {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  DepNo: string;

  @Column({ type: 'varchar', length: 100 })
  DepName: string;

  @Column({ type: 'varchar', length: 100 })
  Location: string;

  @OneToMany(() => EmpRecord, (emp) => emp.department)
  employees: EmpRecord[];
}
