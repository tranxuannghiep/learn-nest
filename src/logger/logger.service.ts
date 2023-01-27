import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  count = 0;
  log(): number {
    return this.count++;
  }
}
