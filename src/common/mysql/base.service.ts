import { Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export class BaseService<Entity extends BaseEntity<Entity>> {
  constructor(protected repo: Repository<Entity>) {}
  //   async save(data: Dto): Promise<Dto> {
  //     const saveData = await this.repo.save(data);
  //     return Dto.plainToInstance(saveData);
  //   }
}
