// src/common/validators/is-birth-date.validator.ts

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidCPF', async: false })
export class IsValidCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string) {
    if (cpf.length > 11) {
      let newCpf = '';

      for (let i = 0; i < cpf.length; i++) {
        const item = cpf[i];
        if (isNaN(Number(item))) {
          if (item !== '.' && item !== '-') return false;
          else continue;
        }

        newCpf += item;
      }

      cpf = newCpf;
    }

    const arr = new Array(9).fill(0);

    for (let i = 0; i < 9; i++) {
      arr[i] = parseInt(cpf[i]);
    }

    function verifyNextNumber(position: number, arr: number[]) {
      let sum = 0;
      for (let i = position; i > 1; i--) {
        const value = arr[arr.length - i + 1] * i;
        sum += value;

        if (i === 2) {
          const rest = sum % 11;

          if (rest < 2) return 0;
          else return 11 - rest;
        }
      }
    }

    arr.push(verifyNextNumber(10, arr));
    arr.push(verifyNextNumber(11, arr));

    if (
      arr[arr.length - 2] === Number(cpf[cpf.length - 2]) &&
      arr[arr.length - 1] === Number(cpf[cpf.length - 1])
    )
      return true;
    else return false;
  }
}

export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCPFConstraint,
    });
  };
}
