import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnrollmentRequest {
  @PrimaryGeneratedColumn('increment')
  _id: number;

  @Column()
  student_id: number;

  @Column()
  course_id: number;

  @Column()
  created_at: Date;
}
