import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

const DEFAULT_PER_PAGE = 10;
const MAX_PAGE_LIMIT = 50000;

export const PAGINATION = (
  page: number,
  pageLimit: number,
): { STARTPAGE: number; PERPAGE: number; RANGEEND: number } => {
  const PAGE = page || 1;
  let PERPAGE: number;
  if (!pageLimit) {
    PERPAGE = DEFAULT_PER_PAGE;
  } else if (pageLimit > MAX_PAGE_LIMIT) {
    PERPAGE = MAX_PAGE_LIMIT;
  } else {
    PERPAGE = Number.parseInt(String(pageLimit), 10);
  }
  const STARTPAGE = (PAGE - 1) * PERPAGE;
  const RANGEEND = STARTPAGE + PERPAGE;
  return { STARTPAGE, PERPAGE, RANGEEND };
};

export class PaginationDto {
  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number' })
  @IsOptional()
  public page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50000,
    default: 10,
    description: 'Items per page',
  })
  @IsOptional()
  public pageLimit?: number;

  @ApiHideProperty()
  @IsOptional()
  public STARTPAGE?: number;

  @ApiHideProperty()
  @IsOptional()
  public PERPAGE?: number;

  @ApiHideProperty()
  @IsOptional()
  public RANGEEND?: number;
}
