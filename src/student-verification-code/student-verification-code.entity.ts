import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StudentVerificationCode {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  student_id: number;

  @Column()
  code: string;

  @Column()
  expiration_date: Date;
}
