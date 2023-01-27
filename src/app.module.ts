import { Module } from '@nestjs/common';
import { PostModule } from './posts/post.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, PostModule],
})
export class AppModule {}
