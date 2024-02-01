import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBirthDate', async: false })
export class IsBirthDateConstraint implements ValidatorConstraintInterface {
  validate(value: Date | string) {
    value = new Date(value);

    return !isNaN(value.getTime()) && value < new Date();
  }
}

export function IsBirthDate(validationOptions?: ValidationOptions) {
  return function (object: 'any object', propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBirthDateConstraint,
    });
  };
}
