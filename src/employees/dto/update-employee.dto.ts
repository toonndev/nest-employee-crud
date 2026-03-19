import { PartialType } from '@nestjs/swagger';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  @MaxLength(100, { message: 'UPDATED_BY_MAXIMUM_LENGTH' })
  public updatedBy?: string;
}

export class UpdateEmployeeStatusDto {
  @ApiProperty({ description: 'Active status (สถานะการใช้งาน)', example: true })
  @IsBoolean({ message: 'INVALID_PARAMETER' })
  @IsNotEmpty({ message: 'IS_ACTIVE_REQUIRED' })
  isActive: boolean;

  @ApiHideProperty()
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  @MaxLength(100, { message: 'UPDATED_BY_MAXIMUM_LENGTH' })
  updatedBy?: string;
}
