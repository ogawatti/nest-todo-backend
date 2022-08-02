import { HttpException, HttpStatus } from '@nestjs/common';
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

  const errorNotFound = new HttpException('Not Found', HttpStatus.NOT_FOUND);
  const errorBadRequest = new HttpException(
    'Bad Request',
    HttpStatus.BAD_REQUEST,
  );

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
    describe('when specified task found', () => {
      it('should return a task', async () => {
        const spy = jest
          .spyOn(service, 'findOne')
          .mockImplementation(() => Promise.resolve(task));

        expect(await controller.findOne(taskId)).toBe(task);
        expect(spy).toHaveBeenCalledWith(task.id);
        spy.mockRestore();
      });
    });

    describe('when specified task does not found', () => {
      it('should throw exception', async () => {
        const spy = jest
          .spyOn(service, 'findOne')
          .mockImplementation(() => Promise.resolve(null));

        await expect(controller.findOne(taskId)).rejects.toThrow(errorNotFound);
        expect(spy).toHaveBeenCalledWith(task.id);
        spy.mockRestore();
      });
    });
  });

  describe('update', () => {
    describe('when specified task found', () => {
      const updateTaskDto = new UpdateTaskDto();
      updateTaskDto.content = 'test';
      updateTaskDto.done = true;

      it('should return a task', async () => {
        const spy = jest
          .spyOn(service, 'update')
          .mockImplementation(() => Promise.resolve(task));

        expect(await controller.update(taskId, updateTaskDto)).toBe(task);
        expect(spy).toHaveBeenCalledWith(task.id, updateTaskDto);
        spy.mockRestore();
      });
    });

    describe('when specified task does not found', () => {
      const updateTaskDto = new UpdateTaskDto();
      updateTaskDto.content = 'test';
      updateTaskDto.done = true;

      it('should throw exception', async () => {
        const spy = jest
          .spyOn(service, 'update')
          .mockImplementation(() => Promise.resolve(undefined));

        await expect(controller.update(taskId, updateTaskDto)).rejects.toThrow(
          errorNotFound,
        );
        expect(spy).toHaveBeenCalledWith(task.id, updateTaskDto);
        spy.mockRestore();
      });
    });

    describe('when request body is empty', () => {
      const updateTaskDto = new UpdateTaskDto();

      it('should throw exception', async () => {
        await expect(controller.update(taskId, updateTaskDto)).rejects.toThrow(
          errorBadRequest,
        );
      });
    });
  });

  describe('remove', () => {
    describe('when specified task found', () => {
      it('should return undefined', async () => {
        const spy = jest
          .spyOn(service, 'remove')
          .mockImplementation(() => Promise.resolve(true));

        expect(await controller.remove(taskId)).toBe(undefined);
        expect(spy).toHaveBeenCalledWith(task.id);
        spy.mockRestore();
      });
    });

    describe('when specified task does not found', () => {
      it('should throw exception', async () => {
        const spy = jest
          .spyOn(service, 'remove')
          .mockImplementation(() => Promise.resolve(false));

        await expect(controller.remove(taskId)).rejects.toThrow(errorNotFound);
        expect(spy).toHaveBeenCalledWith(task.id);
        spy.mockRestore();
      });
    });
  });
});
