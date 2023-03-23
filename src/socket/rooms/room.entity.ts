import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MessageEntity } from '../messages/message.entity';
import { JoinedRoomEntity } from './joined-room.entity';

@Entity({ name: 'room' })
export class RoomEntity extends BaseEntity<RoomEntity> {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];
}
