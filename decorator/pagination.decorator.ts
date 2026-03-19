import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PAGINATION } from '@/constants/pagination';

export const QueryPage = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query || {};
    return { ...query, ...PAGINATION(query.page, query.pageLimit) };
  },
);
