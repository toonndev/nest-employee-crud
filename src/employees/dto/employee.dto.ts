import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty({ example: 'uuid-xxxx-xxxx' })
  id: string;

  @ApiProperty({ example: 'สมชาย' })
  firstName: string;

  @ApiProperty({ example: 'ใจดี' })
  lastName: string;

  @ApiProperty({ example: 'somchai@example.com' })
  email: string;

  @ApiProperty({ example: 'Software Developer' })
  position: string;

  @ApiProperty({ example: 50000 })
  salary: number;

  @ApiPropertyOptional({ example: 'Engineering' })
  department?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: 'admin' })
  createdBy?: string;

  @ApiPropertyOptional({ example: 'admin' })
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
