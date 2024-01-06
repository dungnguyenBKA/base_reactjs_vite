import React from "react";
import { FormikErrors } from "formik/dist/types";
import { NotDefined } from "../config/AppData";
import validator from "validator";
import { extend } from "lodash";

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export type HtmlProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>

export type Validator<DataType = any> = (input: NotDefined<DataType>) => [boolean, string]


export type FieldValidatorRecord<FormType> = {
  [key in keyof FormType]?: Validator<FormType[key]>[]
}

export class AppValidation {
  static validate<DataType>(input: NotDefined<DataType>, validators: Validator<DataType>[]): [boolean, string] {
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](input);
      if (!result[0]) {
        return result;
      }
    }
    return [true, ""];
  }

  static validateField<FormType, Field extends keyof FormType>(value: FormType[Field], validators: Validator<FormType[Field]>[]): [boolean, string] {
    for (let i = 0; i < validators.length; i++) {
      const result = validators[i](value);
      if (!result[0]) {
        return result;
      }
    }
    return [true, ""];
  }

  static getErrorValidate<FormType extends {}>(object: FormType, validatorRecord: FieldValidatorRecord<FormType>): FormikErrors<FormType> {
    const errors: FormikErrors<FormType> = {};
    (Object.keys(object) as (keyof FormType)[])?.forEach(key => {
      const validators = validatorRecord[key];
      if (validators) {
        const result = this.validateField(object[key], validators);
        if (!result[0]) {
          // @ts-ignore
          errors[key] = result[1];
        }
      }
    });
    return errors;
  }

  static notEmpty: Validator<string> = (input) => {
    if (!input) {
      return [false, "Required"];
    }

    if (!input.trim()) {
      return [false, "Required"];
    }

    return [true, ""];
  };

  static moreThan8Char: Validator<string> = (input) => {
    if (!input) {
      return [false, "Required"];
    }

    if (input.length < 8) {
      return [false, "Must more than 8 characters"];
    }

    return [true, ""];
  };

  static arrayMoreThan3 = function <DataType>(input: NotDefined<DataType[]>): ReturnType<Validator<DataType>> {
    if (!input) {
      return [false, "Required"];
    }

    if (input.length < 3) {
      return [false, "Must more than 3"];
    }

    return [true, ""];
  };

  static isEmail: Validator<string> = (input) => {
    if (!input) {
      return [false, "Required"];
    }

    if (!validator.isEmail(input)) {
      return [false, "Email is not right format"];
    }

    return [true, ""];
  };

  static isPhoneNumber: Validator<string> = (input) => {
    if (!input) {
      return [false, "Required"];
    }

    if (!validator.isMobilePhone(input)) {
      return [false, "Phone is not right format"];
    }

    return [true, ""];
  };

  static arrayNotEmpty = function <DataType>(input: NotDefined<DataType[]>): ReturnType<Validator<DataType>> {
    if (!input) {
      return [false, "Required"];
    }

    if (input.length === 0) {
      return [false, "Required"];
    }

    return [true, ""];
  };

  static hasNoDuplicates(input: string): boolean {
    // Use a Set to keep track of unique characters
    const uniqueChars = new Set();

    // Iterate through each character in the input string
    for (const char of input) {
      // If the character is already in the set, there is a duplicate
      if (uniqueChars.has(char)) {
        return false;
      }

      // Otherwise, add the character to the set
      uniqueChars.add(char);
    }

    // If the loop completes without returning false, there are no duplicates
    return true;
  }
}

export function flattenList<DataType>(original: DataType[], childrenKey: keyof DataType): DataType[] {
  const flattenedList: DataType[] = [];

  function flatten(item: DataType) {
    flattenedList.push(item);
    if (item[childrenKey] && Array.isArray(item[childrenKey])) {
      (item[childrenKey] as DataType[]).forEach((child: DataType) => {
        flatten(child);
      });
      delete item[childrenKey];
    }
  }

  original.forEach((item: DataType) => {
    flatten(item);
  });

  return flattenedList;
}

type ClickHandler = (e: React.SyntheticEvent<Element, Event>) => void

export function toDoubleClickHandler(onClick?: ClickHandler) {
  return (e: React.SyntheticEvent<Element, Event>) => {
    // @ts-ignore
    const detail: number = e.detail;
    if (detail == 2) {
      onClick?.(e);
      return;
    }
  };
}

export function recursiveMap<InType, OutType, InChildren extends keyof InType, OutChildren extends keyof OutType>(
  data: InType,
  inChildren: InChildren,
  outChildren: OutChildren,
  mapper: (value: Omit<InType, InChildren>, parent?: InType,) => Omit<OutType, OutChildren>,
  parent?: InType
): OutType {
  const children = data[inChildren];
  const childrenAfter: OutType[] | undefined = [];
  if (children && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      childrenAfter.push(recursiveMap(children[i], inChildren, outChildren, mapper, data));
    }
  }

  const mappedData = mapper(data, parent);

  return {
    ...mappedData,
    [outChildren]: childrenAfter.length > 0 ? childrenAfter : undefined,
  } as OutType;
}

/**
 * Array extensions
 * */

declare global {
  interface Array<T> {
    first(): T | undefined;
  }
}
Array.prototype.first = function <T>(this: T[]): T | undefined {
  if (this.length > 0) {
    return this[0];
  }
  return undefined;
};

type CompareFunction<T> = (a: T, b: T) => boolean;

export function mergeAndRemoveDuplicates<T>(
  list1: T[],
  list2: T[],
  compare: CompareFunction<T>
): T[] {
  const mergedList: T[] = [...list1];

  for (const item of list2) {
    const existingItemIndex = mergedList.findIndex((existingItem) => compare(existingItem, item));

    if (existingItemIndex === -1) {
      mergedList.push(item);
    } else {
      // If you want to update existing items, you can do so here
      // mergedList[existingItemIndex] = item;
    }
  }

  return mergedList;
}


export function nonDefinedMapper<T>(data: T | null | undefined) {
  if (!data) {
    return "N/A";
  }

  return String(data);
}
