import { Length } from 'class-validator';

export class EnrollmentRequestBulkDto {
  @Length(6, 6, { each: true })
  courseCodes: string[];
}
