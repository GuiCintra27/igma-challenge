import { HttpException } from '@nestjs/common';

export class ConflictError extends HttpException {
  constructor({ message }: { message: string }) {
    super(message, 409);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
