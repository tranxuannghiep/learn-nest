import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  softDeleteAt: Date;

  static plainToInstance<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToInstance(this, obj, { excludeExtraneousValues: true });
  }
}
