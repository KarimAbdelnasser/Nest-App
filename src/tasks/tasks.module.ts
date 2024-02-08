import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './task.schema';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    UserModule,
  ],
  exports: [TasksService],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TaskModule {}
