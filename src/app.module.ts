import { Module } from '@nestjs/common';
import { PostModule } from './posts/post.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, PostModule, StoreModule.forRoot()],
})
export class AppModule {}
