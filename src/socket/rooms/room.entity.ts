import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { MessageEntity } from '../messages/message.entity';

@Entity({ name: 'room' })
export class RoomEntity extends BaseEntity<RoomEntity> {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  @JoinTable({
    name: 'joined-room',
    joinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];
}
