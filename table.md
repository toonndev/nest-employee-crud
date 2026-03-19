# Database Schema & Seed Data

---

## Table: Department

### Entity (`department.entity.ts`)

```typescript
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('Department')
export class Department {
  @PrimaryColumn()
  DepNo: string;

  @Column()
  DepName: string;

  @Column()
  Location: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
```

### Seed Data

| DepNo | DepName        | Location   |
|-------|----------------|------------|
| 00    | Executive      | Silom      |
| 10    | Accounting     | Silom      |
| 20    | Administration | Sukhumvit  |
| 30    | Sales          | Ratchada   |
| 40    | Marketing      | Silom      |
| 50    | Research       | Sukhumvit  |

> ⚠️ DepNo 50 (Research) ไม่มีพนักงานสังกัด

---

## Table: Employee

### Entity (`employee.entity.ts`)

```typescript
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from '../department/department.entity';

@Entity('Employee')
export class Employee {
  @PrimaryColumn()
  EmpNum: string;

  @Column()
  EmpName: string;

  @Column({ type: 'date' })
  HireDate: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Salary: number;

  @Column({ nullable: true })
  Position: string;

  @Column({ nullable: true })
  DepNo: string;

  @Column({ nullable: true })
  HeadNo: string;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'DepNo' })
  department: Department;
}
```

### Seed Data

| EmpNum | EmpName   | HireDate   | Salary    | Position          | DepNo | HeadNo |
|--------|-----------|------------|-----------|-------------------|-------|--------|
| 0001   | Kanjana   | 1994-07-10 | 50,000.00 | Managing Director | 00    | null   |
| 1001   | Surasit   | 1994-03-15 | 30,000.00 | Manager           | 10    | 0001   |
| 1002   | Jintana   | 1993-10-31 | 20,000.00 | Supervisor        | 10    | 1001   |
| 1003   | Siriwan   | 1993-06-13 | 9,000.00  | Clerk             | 10    | 1001   |
| 2001   | Ternjai   | 1994-11-01 | 24,000.00 | Manager           | 20    | 0001   |
| 2002   | Chai      | 1993-05-14 | 14,000.00 | Clerk             | 20    | 2001   |
| 3001   | Benjawan  | 1994-06-11 | 29,000.00 | Manager           | 30    | 0001   |
| 3002   | Tanachote | 1994-06-14 | 25,000.00 | Supervisor        | 30    | 3001   |
| 3003   | Arlee     | 1993-08-15 | 17,000.00 | Salesman          | 30    | 3001   |
| 3004   | Mitree    | 1993-05-12 | 13,000.00 | Salesman          | 30    | 3001   |
| 3005   | Tawatchai | 1994-07-03 | 10,000.00 | Salesman          | 30    | 3001   |
| 4001   | Wichai    | 1993-12-26 | 33,000.00 | Manager           | 40    | 0001   |
| 4002   | Thidarat  | 1994-01-12 | 9,000.00  | Clerk             | 40    | 4001   |

---

## Table: EmployeeBackup

### Entity (`employee-backup.entity.ts`)

```typescript
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('EmployeeBackup')
export class EmployeeBackup {
  @PrimaryColumn()
  EmpNum: string;

  @Column()
  EmpName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Salary: number;

  @Column({ nullable: true })
  Position: string;
}
```

### Seed Data

> ตารางนี้เริ่มต้นว่างเปล่า — ข้อมูลจะถูก INSERT จาก Employee ที่มี DepNo = 20, 30 (ข้อ 13)

```sql
INSERT INTO EmployeeBackup (EmpNum, EmpName, Salary, Position)
SELECT EmpNum, EmpName, Salary, Position
FROM Employee
WHERE DepNo IN ('20', '30');
```

ผลลัพธ์หลัง INSERT:

| EmpNum | EmpName   | Salary    | Position |
|--------|-----------|-----------|----------|
| 2001   | Ternjai   | 24,000.00 | Manager  |
| 2002   | Chai      | 14,000.00 | Clerk    |
| 3001   | Benjawan  | 29,000.00 | Manager  |
| 3002   | Tanachote | 25,000.00 | Supervisor |
| 3003   | Arlee     | 17,000.00 | Salesman |
| 3004   | Mitree    | 13,000.00 | Salesman |
| 3005   | Tawatchai | 10,000.00 | Salesman |

---

## Relations

```
Department  (1) ──── (N)  Employee     [ DepNo ]
Employee    (1) ──── (N)  Employee     [ HeadNo → EmpNum (self-reference) ]
Employee    (N) ──── (1)  EmployeeBackup  [ copy DepNo 20, 30 only ]
```

---

## Seeder (`employee.seeder.ts`)

```typescript
import { DataSource } from 'typeorm';
import { Employee } from '../../employee/employee.entity';
import { Department } from '../../department/department.entity';

export async function seedDatabase(dataSource: DataSource) {
  const departmentRepo = dataSource.getRepository(Department);
  const employeeRepo   = dataSource.getRepository(Employee);

  await employeeRepo.delete({});
  await departmentRepo.delete({});

  const departments = departmentRepo.create([
    { DepNo: '00', DepName: 'Executive',      Location: 'Silom' },
    { DepNo: '10', DepName: 'Accounting',     Location: 'Silom' },
    { DepNo: '20', DepName: 'Administration', Location: 'Sukhumvit' },
    { DepNo: '30', DepName: 'Sales',          Location: 'Ratchada' },
    { DepNo: '40', DepName: 'Marketing',      Location: 'Silom' },
    { DepNo: '50', DepName: 'Research',       Location: 'Sukhumvit' },
  ]);
  await departmentRepo.save(departments);

  const employees = employeeRepo.create([
    { EmpNum: '0001', EmpName: 'Kanjana',   HireDate: '1994-07-10', Salary: 50000, Position: 'Managing Director', DepNo: '00', HeadNo: null },
    { EmpNum: '1001', EmpName: 'Surasit',   HireDate: '1994-03-15', Salary: 30000, Position: 'Manager',           DepNo: '10', HeadNo: '0001' },
    { EmpNum: '1002', EmpName: 'Jintana',   HireDate: '1993-10-31', Salary: 20000, Position: 'Supervisor',        DepNo: '10', HeadNo: '1001' },
    { EmpNum: '1003', EmpName: 'Siriwan',   HireDate: '1993-06-13', Salary: 9000,  Position: 'Clerk',             DepNo: '10', HeadNo: '1001' },
    { EmpNum: '2001', EmpName: 'Ternjai',   HireDate: '1994-11-01', Salary: 24000, Position: 'Manager',           DepNo: '20', HeadNo: '0001' },
    { EmpNum: '2002', EmpName: 'Chai',      HireDate: '1993-05-14', Salary: 14000, Position: 'Clerk',             DepNo: '20', HeadNo: '2001' },
    { EmpNum: '3001', EmpName: 'Benjawan',  HireDate: '1994-06-11', Salary: 29000, Position: 'Manager',           DepNo: '30', HeadNo: '0001' },
    { EmpNum: '3002', EmpName: 'Tanachote', HireDate: '1994-06-14', Salary: 25000, Position: 'Supervisor',        DepNo: '30', HeadNo: '3001' },
    { EmpNum: '3003', EmpName: 'Arlee',     HireDate: '1993-08-15', Salary: 17000, Position: 'Salesman',          DepNo: '30', HeadNo: '3001' },
    { EmpNum: '3004', EmpName: 'Mitree',    HireDate: '1993-05-12', Salary: 13000, Position: 'Salesman',          DepNo: '30', HeadNo: '3001' },
    { EmpNum: '3005', EmpName: 'Tawatchai', HireDate: '1994-07-03', Salary: 10000, Position: 'Salesman',          DepNo: '30', HeadNo: '3001' },
    { EmpNum: '4001', EmpName: 'Wichai',    HireDate: '1993-12-26', Salary: 33000, Position: 'Manager',           DepNo: '40', HeadNo: '0001' },
    { EmpNum: '4002', EmpName: 'Thidarat',  HireDate: '1994-01-12', Salary: 9000,  Position: 'Clerk',             DepNo: '40', HeadNo: '4001' },
  ]);
  await employeeRepo.save(employees);

  console.log('✅ Seeding completed!');
}
```