import { Injectable, Inject } from '@nestjs/common';
import { STORE_CONFIG } from 'src/store/store.config';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class PostService {
  constructor(
    @Inject(`${STORE_CONFIG}posts.json`)
    private readonly storeService: StoreService,
  ) {}

  createPost(post: any): any {
    this.storeService.save(post);
    return post;
  }
}
