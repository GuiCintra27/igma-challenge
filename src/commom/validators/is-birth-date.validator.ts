import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBirthDate', async: false })
export class IsBirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: Date) {
    return (
      value instanceof Date && !isNaN(value.getTime()) && value < new Date()
    );
  }
}

export function IsBirthDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBirthDateConstraint,
    });
  };
}
