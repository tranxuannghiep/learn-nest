import { Module } from '@nestjs/common';
import { StoreModule } from 'src/store/store.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    StoreModule.forFeature({
      filename: 'posts.json',
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
