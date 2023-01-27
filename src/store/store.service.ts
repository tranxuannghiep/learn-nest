import { Injectable, Inject, Optional } from '@nestjs/common';
import * as fs from 'fs';
import { StoreConfig, STORE_CONFIG } from './store.config';

@Injectable()
export class StoreService {
  constructor(
    @Optional() @Inject(STORE_CONFIG) private readonly storeConfig: StoreConfig,
  ) {
    if (!fs.existsSync(this.storeConfig.dirname)) {
      fs.mkdirSync(this.storeConfig.dirname);
    }
  }
  save(data: any): void {
    fs.appendFileSync(
      `${this.storeConfig.dirname}/${this.storeConfig.filename}`,
      JSON.stringify(data),
    );
  }
}
