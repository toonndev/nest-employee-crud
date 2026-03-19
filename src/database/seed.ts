import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { Department } from '../../entities/department.entity';
import { EmpRecord } from '../../entities/emp-record.entity';
import { EmployeeBackup } from '../../entities/employee-backup.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'employee_crud',
  schema: process.env.DB_SCHEMA || 'public',
  dropSchema: true,
  synchronize: true,
  entities: [Employee, Department, EmpRecord, EmployeeBackup],
});

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database');

  const employeeRepo = dataSource.getRepository(Employee);
  const departmentRepo = dataSource.getRepository(Department);
  const empRecordRepo = dataSource.getRepository(EmpRecord);
  const backupRepo = dataSource.getRepository(EmployeeBackup);

  console.log('Tables dropped and recreated');

  // Seed departments
  const departments = departmentRepo.create([
    { DepNo: '00', DepName: 'Executive',      Location: 'Silom' },
    { DepNo: '10', DepName: 'Accounting',     Location: 'Silom' },
    { DepNo: '20', DepName: 'Administration', Location: 'Sukhumvit' },
    { DepNo: '30', DepName: 'Sales',          Location: 'Ratchada' },
    { DepNo: '40', DepName: 'Marketing',      Location: 'Silom' },
    { DepNo: '50', DepName: 'Research',       Location: 'Sukhumvit' },
  ]);
  await departmentRepo.save(departments);
  console.log('Seeded departments (6 rows)');

  const empData = [
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
  ];

  // Seed employees (CRUD table)
  await employeeRepo.save(employeeRepo.create(empData));
  console.log('Seeded employees (13 rows)');

  // Seed exercise employee table
  await empRecordRepo.save(empRecordRepo.create(empData));
  console.log('Seeded employee table (13 rows)');

  // Seed employee_backup from DepNo 20 and 30
  await dataSource.query(`
    INSERT INTO "employee_backup" ("EmpNum", "EmpName", "Salary", "Position")
    SELECT "EmpNum", "EmpName", "Salary", "Position"
    FROM "employee"
    WHERE "DepNo" IN ('20', '30')
  `);
  console.log('Seeded employee_backup (DepNo 20, 30)');

  await dataSource.destroy();
  console.log('Seeding completed!');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
