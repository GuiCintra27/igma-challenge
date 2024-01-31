import { HttpException } from '@nestjs/common';

export class NotFoundError extends HttpException {
  constructor({ message }: { message: string }) {
    super(message, 404);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
