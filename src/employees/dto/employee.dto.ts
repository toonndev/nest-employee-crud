import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: '0001' })
  EmpNum: string;

  @ApiProperty({ example: 'Kanjana' })
  EmpName: string;

  @ApiProperty({ example: '1994-07-10' })
  HireDate: string;

  @ApiProperty({ example: 50000 })
  Salary: number;

  @ApiPropertyOptional({ example: 'Managing Director' })
  Position?: string;

  @ApiPropertyOptional({ example: '00' })
  DepNo?: string;

  @ApiPropertyOptional({ example: null })
  HeadNo?: string;
}
