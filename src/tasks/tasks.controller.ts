import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskDto } from './dtos/task.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task-dto';
import { UpdateTaskDto } from './dtos/update-task-dto';
import { UsersService } from 'src/users/users.service';

@Controller('task')
@Serialize(TaskDto)
export class TasksController {
  constructor(
    private tasksServices: TasksService,
    private usersService: UsersService,
  ) {}

  @Post('/new')
  async createTask(@Req() req, @Body() body: CreateTaskDto, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const task = await this.tasksServices.create(body, userId);

    res.json({
      message: `Your task with title | ${task.title} | Has been created succfully!`,
    });
  }

  @Get('/getAll')
  async getAllTasks(@Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const tasks = await this.tasksServices.getAllTasks(userId);

    res.json({ data: tasks });
  }

  @Get('/getById/:id')
  async getById(@Param('id') id: string, @Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const task = await this.tasksServices.getOne(userId, id);

    res.json({ data: task });
  }

  @Patch('/update/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateTask(
    @Param('id') id: string,
    @Body()
    updatedTaskDto: UpdateTaskDto,
    @Req() req,
    @Res() res,
  ) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const updatedTask = await this.tasksServices.update(
      id,
      userId,
      updatedTaskDto,
    );

    res.json({ data: updatedTask });
  }

  @Delete('/delete/:id')
  async DeleteById(@Param('id') id: string, @Req() req, @Res() res) {
    if (!req.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.user._id;

    const task = await this.tasksServices.delete(userId, id);

    res.json({
      message: `This task ${task.title} have been removed succfully!`,
    });
  }

  @Get('/getAllTasks')
  async getAll(@Res() res) {
    const tasks = await this.tasksServices.getAll();

    return res.json({
      message: 'Successfully fetched all tasks',
      data: tasks,
    });
  }

  @Delete('/remove/:id')
  async removeTask(@Param('id') id: string, @Res() res) {
    const task = await this.tasksServices.removeTask(id);

    return res.json({
      message: `Task with title ${task.title} removed successfully`,
    });
  }
}
