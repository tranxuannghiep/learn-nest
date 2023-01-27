import { Module, DynamicModule } from '@nestjs/common';
import {
  StoreConfig,
  StoreFeatureConfig,
  StoreRootConfig,
  STORE_CONFIG,
} from './store.config';
import { StoreService } from './store.service';

let rootStoreConfig: StoreConfig;
const DEFAULT_STORE_DIRNAME = 'store';
const DEFAULT_STORE_FILENAME = 'data.json';

@Module({
  providers: [StoreService],
  exports: [StoreService],
})
class RootStoreModule {}

@Module({})
export class StoreModule {
  static forRoot(storeConfig?: StoreRootConfig): DynamicModule {
    rootStoreConfig = StoreModule.createConfig(storeConfig);
    return {
      module: RootStoreModule,
      providers: [
        {
          provide: STORE_CONFIG,
          useValue: rootStoreConfig,
        },
      ],
    };
  }
  static forFeature(storeConfig?: StoreFeatureConfig): DynamicModule {
    const token = STORE_CONFIG + storeConfig.filename;
    return {
      module: StoreModule,
      providers: [
        {
          provide: token,
          useFactory: () => {
            const featureStoreConfig = StoreModule.createConfig({
              ...rootStoreConfig,
              ...storeConfig,
            });
            return new StoreService(featureStoreConfig);
          },
        },
      ],
      exports: [token],
    };
  }

  private static createConfig(config: StoreConfig): StoreConfig {
    const defaultConfig: StoreConfig = {
      dirname: DEFAULT_STORE_DIRNAME,
      filename: DEFAULT_STORE_FILENAME,
    };
    return { ...defaultConfig, ...config };
  }
}
