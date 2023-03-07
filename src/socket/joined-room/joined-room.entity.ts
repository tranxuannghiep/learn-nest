import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoomEntity } from '../rooms/room.entity';

@Entity({ name: 'joined-room' })
export class JoinedRoomEntity extends BaseEntity<JoinedRoomEntity> {
  @JoinColumn({ name: 'room_id' })
  @ManyToOne(() => RoomEntity, (room) => room.joinedRooms)
  room: RoomEntity;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => UserEntity, (user) => user.joinedRooms)
  user: UserEntity;
}
