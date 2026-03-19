import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Employee name (ชื่อพนักงาน)', example: 'Kanjana', maxLength: 100 })
  @MaxLength(100, { message: 'EMP_NAME_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'EMP_NAME_REQUIRED' })
  EmpName: string;

  @ApiProperty({ description: 'Hire date (วันที่เริ่มงาน)', example: '1994-07-10' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'HIRE_DATE_REQUIRED' })
  HireDate: string;

  @ApiProperty({ description: 'Salary (เงินเดือน)', example: 50000 })
  @IsNumber({}, { message: 'INVALID_PARAMETER' })
  @IsPositive({ message: 'SALARY_MUST_BE_POSITIVE' })
  @IsNotEmpty({ message: 'SALARY_REQUIRED' })
  Salary: number;

  @ApiPropertyOptional({ description: 'Position (ตำแหน่ง)', example: 'Manager', maxLength: 100 })
  @MaxLength(100, { message: 'POSITION_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsOptional()
  Position?: string;

  @ApiPropertyOptional({ description: 'Department number (รหัสแผนก)', example: '10', maxLength: 10 })
  @MaxLength(10, { message: 'DEP_NO_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsOptional()
  DepNo?: string;

  @ApiPropertyOptional({ description: 'Head employee number (รหัสหัวหน้า)', example: '0001', maxLength: 10 })
  @MaxLength(10, { message: 'HEAD_NO_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsOptional()
  HeadNo?: string;

  @ApiHideProperty()
  @IsOptional()
  createdBy?: string;
}
