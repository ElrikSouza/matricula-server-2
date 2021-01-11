import { Module } from '@nestjs/common';
import { CacheModule } from 'src/cache/cache.module';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [CacheModule],
  exports: [CoursesService],
})
export class CoursesModule {}
