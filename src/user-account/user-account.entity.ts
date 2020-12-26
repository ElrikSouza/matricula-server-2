import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAccount {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  student_id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
