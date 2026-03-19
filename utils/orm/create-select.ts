import { FindOptionsSelect } from 'typeorm';

export const createSelect = <T extends object>(
  fields: (keyof T)[],
): FindOptionsSelect<T> => {
  return fields.reduce((acc, field) => {
    (acc as any)[field] = true;
    return acc;
  }, {} as FindOptionsSelect<T>);
};
