import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
