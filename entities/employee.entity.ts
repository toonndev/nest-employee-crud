import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('employees')
@Index(['email', 'isActive'])
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, comment: 'First name (ชื่อ)' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, comment: 'Last name (นามสกุล)' })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'Email address (อีเมล)',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 150,
    comment: 'Job position (ตำแหน่งงาน)',
  })
  position: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Salary (เงินเดือน)',
  })
  salary: number;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Department (แผนก)',
  })
  department?: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Active status (สถานะการใช้งาน)',
  })
  @Index()
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Created by (ผู้สร้าง)',
  })
  createdBy?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Updated by (ผู้แก้ไขล่าสุด)',
  })
  updatedBy?: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    comment: 'Created date (วันที่สร้าง)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: 'Updated date (วันที่แก้ไขล่าสุด)',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeFields() {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }
    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }
    if (this.lastName) {
      this.lastName = this.lastName.trim();
    }
  }
}

export const employeeAttributes: (keyof Employee)[] = [
  'id',
  'firstName',
  'lastName',
  'email',
  'position',
  'salary',
  'department',
  'isActive',
  'createdBy',
  'updatedBy',
  'createdAt',
  'updatedAt',
];
