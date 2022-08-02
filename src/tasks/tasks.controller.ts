import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);

    if (task) {
      return task;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    if (Object.keys(updateTaskDto).length == 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const task = await this.tasksService.update(+id, updateTaskDto);

    if (task) {
      return task;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const task = await this.tasksService.remove(+id);

    if (!task) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
