import { Repository } from 'typeorm';
import { BaseDto } from '../base.dto';
import { BaseEntity } from './base.entity';

export class BaseService<Entity extends BaseEntity, Dto extends BaseDto> {
  constructor(protected repo: Repository<Entity>) {}
  //   async save(data: Dto): Promise<Dto> {
  //     const saveData = await this.repo.save(data);
  //     return Dto.plainToInstance(saveData);
  //   }
}
