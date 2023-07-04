import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function toMongoObjectIdTransform({ value, key }): Types.ObjectId | Types.ObjectId[] | Record<any, Types.ObjectId> {
  if (Array.isArray(value)) {
    const arr: Types.ObjectId[] = [];
    for (let i = 0; i < value.length; i++) {
      if (Types.ObjectId.isValid(value[i])) {
        arr.push(new Types.ObjectId(value[i]));
      } else {
        throw new BadRequestException(`${key} is not a valid MongoId`);
      }
    }
    if (value.length) {
      return arr;
    }
  }

  if (typeof value === 'object') {
    const result: Record<any, any> = {};
    for (let nestedKey in value) {
      if ((value as Object).hasOwnProperty(nestedKey)) {
        result[nestedKey] = toMongoObjectIdTransform({
          value: value[nestedKey],
          key: nestedKey,
        });
      }
    }
    return result;
  }

  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value);
  }

  throw new BadRequestException(`${value} is not a valid MongoId`);
}
