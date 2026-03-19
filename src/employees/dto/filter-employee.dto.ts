import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/constants/pagination';

export class FilterEmployeeDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search in firstName, lastName, email, position (ค้นหา)',
    example: 'สมชาย',
  })
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by (จัดเรียงตาม)',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  readonly sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order (ทิศทางการจัดเรียง)',
    enum: ['ASC', 'DESC', 'asc', 'desc'],
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], { message: 'INVALID_PARAMETER' })
  readonly sortType?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status (กรองตามสถานะ)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'INVALID_PARAMETER' })
  readonly isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by department (กรองตามแผนก)',
    example: 'Engineering',
  })
  @IsOptional()
  @IsString({ message: 'INVALID_PARAMETER' })
  readonly department?: string;
}
