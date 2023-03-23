import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity({ name: 'joined-room' })
export class JoinedRoomEntity extends BaseEntity<JoinedRoomEntity> {
  @Column({ name: 'unread_count', default: 0 })
  unreadCount: number;

  @ManyToOne(() => RoomEntity, (room) => room.joinedRooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.joinedRooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
