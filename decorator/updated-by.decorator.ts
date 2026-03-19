import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BodyWithUpdatedBy = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body || {};
    const fullName = request.raw?.fullName || request.fullName || 'system';
    return { ...body, updatedBy: fullName };
  },
);
