import { HttpException } from '@nestjs/common';

export class InvalidDataError extends HttpException {
  constructor({
    message,
    name,
    status,
  }: {
    message: string;
    name: string;
    status: number;
  }) {
    super(message, status);

    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
}
