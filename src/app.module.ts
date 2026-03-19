import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSTGRESQL } from '@/config/db-config';
import { Employee } from '@/entities/employee.entity';
import { Department } from '@/entities/department.entity';
import { EmpRecord } from '@/entities/emp-record.entity';
import { EmployeeBackup } from '@/entities/employee-backup.entity';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRESQL.host,
      port: parseInt(POSTGRESQL.port, 10),
      username: POSTGRESQL.user,
      password: POSTGRESQL.password,
      database: POSTGRESQL.database,
      schema: POSTGRESQL.schema,
      logging: POSTGRESQL.logging,
      synchronize: POSTGRESQL.synchronize,
      entities: [Employee, Department, EmpRecord, EmployeeBackup],
      extra: {
        max: POSTGRESQL.pool.max,
        min: POSTGRESQL.pool.min,
        idleTimeoutMillis: POSTGRESQL.pool.idleTimeoutMillis,
        connectionTimeoutMillis: POSTGRESQL.pool.connectionTimeoutMillis,
      },
    }),
    EmployeesModule,
  ],
})
export class AppModule {}
