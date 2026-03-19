import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { MSG_MASTER } from '@/message/msg-master';

export class GlobalValidationPipe extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const response = e.getResponse() as any;
        if (
          typeof response === 'object' &&
          response.message &&
          Array.isArray(response.message)
        ) {
          const specificMessages = response.message.join(', ');
          const errorPayload = {
            ...MSG_MASTER.INVALID_PARAMETERS,
            description: specificMessages,
          };
          throw new BadRequestException(errorPayload);
        }
      }
      throw e;
    }
  }
}
