import { Exclude, Expose, Transform } from 'class-transformer';
import { BookEntity } from 'src/books/book.entity';
import { BaseEntity } from 'src/common/mysql/base.entity';
import { OrderEntity } from 'src/orders/order.entity';
import { JoinedRoomEntity } from 'src/socket/joined-room/joined-room.entity';
import { MessageEntity } from 'src/socket/messages/message.entity';
import { RoomEntity } from 'src/socket/rooms/room.entity';
import { encodePassword } from 'src/utils/bcrypt';
import { Role } from 'src/utils/types';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity<UserEntity> {
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  firstname: string;

  @Exclude()
  @Column()
  lastname: string;

  @Transform(({ obj }) => obj.firstname + ' ' + obj.lastname)
  @Expose()
  fullname: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Customer,
  })
  roles: string;

  @OneToMany(() => BookEntity, (book) => book.seller)
  books: BookEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @Column({
    nullable: true,
  })
  image?: string;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.user, {
    onDelete: 'CASCADE',
  })
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await encodePassword(this.password);
    }
  }
}
