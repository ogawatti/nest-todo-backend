import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const insertResult = await this.tasksRepository.insert(createTaskDto);
    return this.tasksRepository.findOneBy({
      id: insertResult.identifiers[0].id,
    });
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  findOne(id: number): Promise<Task> {
    return this.tasksRepository.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateResult = await this.tasksRepository.update(id, updateTaskDto);

    if (updateResult.affected) {
      return this.tasksRepository.findOneBy({ id });
    } else {
      return;
    }
  }

  async remove(id: number): Promise<boolean> {
    const deleteResult = await this.tasksRepository.delete(id);
    return Boolean(deleteResult.affected);
  }
}
