import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { JoinedRoomEntity } from '../joined-room/joined-room.entity';
import { MessageEntity } from '../messages/message.entity';

@Entity({ name: 'room' })
export class RoomEntity extends BaseEntity<RoomEntity> {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  users: UserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room, {
    onDelete: 'CASCADE',
  })
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];
}
