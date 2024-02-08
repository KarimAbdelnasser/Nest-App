import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task-dto';
import { UpdateTaskDto } from './dtos/update-task-dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId: userId,
    });
    return await createdTask.save();
  }

  async getAllTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskModel
      .find({ userId })
      .select('-_id title description status')
      .exec();

    if (!tasks) {
      throw new NotFoundException('No tasks found for the user');
    }

    return tasks;
  }

  async getOne(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel
      .findOne({ _id: taskId, userId })
      .select('-_id title description status')
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(
    id: string,
    userId: string,
    updatedTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updatedTaskDto, { new: true })
      .select('-_id title description status')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async delete(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskModel
      .findOneAndDelete({ _id: taskId, userId })
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async getAll() {
    const tasks = await this.taskModel
      .find()
      .select('-_id userId title description status')
      .exec();

    return tasks;
  }

  async removeTask(id: string) {
    const task = await this.taskModel.findByIdAndDelete(id).exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
