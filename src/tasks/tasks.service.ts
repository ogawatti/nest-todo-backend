import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const insertResult = await Task.insert(createTaskDto);
    return await Task.findOneBy({ id: insertResult.identifiers[0].id });
  }

  async findAll(): Promise<Task[]> {
    return await Task.find();
  }

  async findOne(id: number): Promise<Task> {
    return await Task.findOneBy({ id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateResult = await Task.update(id, updateTaskDto);

    if (updateResult.affected) {
      return await Task.findOneBy({ id });
    } else {
      return;
    }
  }

  async remove(id: number): Promise<boolean> {
    const deleteResult = await Task.delete(id);
    return Boolean(deleteResult.affected);
  }
}
