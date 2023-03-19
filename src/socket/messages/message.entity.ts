import { BaseEntity } from 'src/common/mysql/base.entity';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoomEntity } from '../rooms/room.entity';

@Entity({ name: 'message' })
export class MessageEntity extends BaseEntity<MessageEntity> {
  @Column()
  text: string;

  @Column({
    nullable: true,
  })
  type?: string;

  @Column({
    nullable: true,
  })
  file_name?: string;

  @ManyToOne(() => RoomEntity, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
