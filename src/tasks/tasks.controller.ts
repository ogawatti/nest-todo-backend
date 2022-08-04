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
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('api/tasks')
@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiResponse({ status: 201, type: Task })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Task] })
  async findAll() {
    return await this.tasksService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Task })
  @ApiNotFoundResponse({ description: 'Not found.' })
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);

    if (task) {
      return task;
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Task })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
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
  @ApiNoContentResponse({ description: 'No content.' })
  @ApiNotFoundResponse({ description: 'Not found.' })
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const task = await this.tasksService.remove(+id);

    if (!task) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
