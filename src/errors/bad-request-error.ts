import { HttpException } from '@nestjs/common';

export class BadRequestError extends HttpException {
  constructor({ message }: { message: string }) {
    super(message, 422);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
