import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/constants/pagination';

export const EMPLOYEE_SORT_FIELDS = ['id', 'EmpNum', 'EmpName', 'HireDate', 'Salary', 'Position', 'DepNo', 'HeadNo', 'createdAt'] as const;
export type EmployeeSortField = typeof EMPLOYEE_SORT_FIELDS[number];

export class FilterEmployeeDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search in EmpName, Position (ค้นหา)',
    example: 'Kanjana',
  })
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by (จัดเรียงตาม)',
    enum: EMPLOYEE_SORT_FIELDS,
    example: 'EmpNum',
  })
  @IsOptional()
  @IsIn(EMPLOYEE_SORT_FIELDS, { message: 'INVALID_PARAMETER' })
  readonly sortBy?: EmployeeSortField;

  @ApiPropertyOptional({
    description: 'Sort order (ทิศทางการจัดเรียง)',
    enum: ['ASC', 'DESC', 'asc', 'desc'],
    example: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], { message: 'INVALID_PARAMETER' })
  readonly sortType?: string;

  @ApiPropertyOptional({
    description: 'Filter by department number (กรองตามรหัสแผนก)',
    example: '10',
  })
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  readonly DepNo?: string;
}
