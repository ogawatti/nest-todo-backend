import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly tasks = [
    { id: 1, contents: 'generate resource', done: true },
    { id: 2, contents: 'add api prefix to path', done: true },
    { id: 3, contents: 'return json', done: false },
  ];
  private lastId = this.tasks.length + 1;

  create(createTaskDto: CreateTaskDto) {
    this.lastId++;
    const task = {
      id: this.lastId,
      contents: createTaskDto.contents,
      done: false,
    };
    this.tasks.push(task);
    return task;
  }

  findAll() {
    return this.tasks;
  }

  findOne(id: number) {
    return this.tasks.find((task) => task.id == id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.tasks.find((task) => task.id == id);
    Object.keys(updateTaskDto).forEach((key) => {
      task[key] = updateTaskDto[key];
    });
    return task;
  }

  remove(id: number) {
    const index = this.tasks.findIndex((task) => task.id == id);

    if (index >= 0) {
      return this.tasks.splice(index, 1);
    } else {
      return;
    }
  }
}
