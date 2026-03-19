import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    description: 'First name (ชื่อ)',
    example: 'สมชาย',
    maxLength: 100,
  })
  @MaxLength(100, { message: 'FIRST_NAME_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'FIRST_NAME_REQUIRED' })
  firstName: string;

  @ApiProperty({
    description: 'Last name (นามสกุล)',
    example: 'ใจดี',
    maxLength: 100,
  })
  @MaxLength(100, { message: 'LAST_NAME_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'LAST_NAME_REQUIRED' })
  lastName: string;

  @ApiProperty({
    description: 'Email address (อีเมล)',
    example: 'somchai@example.com',
    maxLength: 255,
  })
  @MaxLength(255, { message: 'EMAIL_MAXIMUM_LENGTH' })
  @IsEmail({}, { message: 'INVALID_EMAIL_FORMAT' })
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  email: string;

  @ApiProperty({
    description: 'Job position (ตำแหน่งงาน)',
    example: 'Software Developer',
    maxLength: 150,
  })
  @MaxLength(150, { message: 'POSITION_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'POSITION_REQUIRED' })
  position: string;

  @ApiProperty({
    description: 'Salary (เงินเดือน)',
    example: 50000,
  })
  @IsNumber({}, { message: 'INVALID_PARAMETER' })
  @IsPositive({ message: 'SALARY_MUST_BE_POSITIVE' })
  @IsNotEmpty({ message: 'SALARY_REQUIRED' })
  salary: number;

  @ApiPropertyOptional({
    description: 'Department (แผนก)',
    example: 'Engineering',
    maxLength: 150,
  })
  @MaxLength(150, { message: 'DEPARTMENT_MAXIMUM_LENGTH' })
  @IsString({ message: 'INVALID_PARAMETER' })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    description: 'Active status (สถานะการใช้งาน)',
    example: true,
    default: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') return true;
      if (value.toLowerCase() === 'false') return false;
    }
    return value;
  })
  @IsBoolean({ message: 'INVALID_PARAMETER' })
  isActive?: boolean;

  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  @MaxLength(100, { message: 'CREATED_BY_MAXIMUM_LENGTH' })
  createdBy?: string;
}
