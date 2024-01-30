// src/common/validators/is-birth-date.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCPF', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (!cpf || (cpf.length !== 11 && cpf.length !== 14)) return false;

    let newCpf = '';
    let dotCounter = 0;
    let dashCounter = 0;

    for (let i = 0; i < cpf.length; i++) {
      const item = cpf[i];
      if (isNaN(Number(item))) {
        switch (item) {
          case '.':
            if (dotCounter > 1 || (i !== 3 && i !== 7)) return false;
            dotCounter++;
            continue;
          case '-':
            if (dashCounter > 0 || i !== 11) return false;
            dashCounter++;
            continue;
          default:
            return false;
        }
      }

      newCpf += item;
    }

    if (newCpf.length !== 11) return false;

    return true;
  }
}

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}
