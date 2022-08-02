import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from '../data-source';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let module: TestingModule;
  let service: TasksService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TasksModule,
        TypeOrmModule.forRoot(DataSourceOptions),
        TypeOrmModule.forFeature([Task]),
      ],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(async () => {
    await module.close();
  });

  const task = new Task();
  task.id = 1;
  task.content = 'test';
  const taskId = String(task.id);

  describe('create', () => {
    it('should return a task', async () => {
      const spy = jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(task));
      const createTaskDto = new CreateTaskDto();
      createTaskDto.content = 'test';

      expect(await controller.create(createTaskDto)).toBe(task);
      expect(spy).toHaveBeenCalledWith(createTaskDto);
      spy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = [task];
      const spy = jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll()).toBe(result);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('findOne', () => {
    it('should return a tasks', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(task));

      expect(await controller.findOne(taskId)).toBe(task);
      expect(spy).toHaveBeenCalledWith(task.id);
      spy.mockRestore();
    });
  });

  describe('update', () => {
    it('should return a tasks', async () => {
      const spy = jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(task));
      const updateTaskDto = new UpdateTaskDto();
      updateTaskDto.content = 'test';
      updateTaskDto.done = true;

      expect(await controller.update(taskId, updateTaskDto)).toBe(task);
      expect(spy).toHaveBeenCalledWith(task.id, updateTaskDto);
      spy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should not return body', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockImplementation(() => Promise.resolve(true));

      expect(await controller.remove(taskId)).toBe(undefined);
      expect(spy).toHaveBeenCalledWith(task.id);
      spy.mockRestore();
    });
  });
});
