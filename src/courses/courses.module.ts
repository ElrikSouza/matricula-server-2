import { CacheModule, Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [CacheModule.register()],
  exports: [CoursesService],
})
export class CoursesModule {}
