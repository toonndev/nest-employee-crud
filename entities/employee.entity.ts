import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('employees')
@Unique(['EmpNum'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
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

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const employeeAttributes: (keyof Employee)[] = [
  'id',
  'EmpNum',
  'EmpName',
  'HireDate',
  'Salary',
  'Position',
  'DepNo',
  'HeadNo',
  'createdBy',
  'updatedBy',
  'createdAt',
  'updatedAt',
];
