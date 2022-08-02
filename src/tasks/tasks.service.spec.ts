import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceOptions } from '../data-source';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let module: TestingModule;
  let repository: Repository<Task>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TasksModule,
        TypeOrmModule.forRoot(DataSourceOptions),
        TypeOrmModule.forFeature([Task]),
      ],
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    const app = module.createNestApplication();
    await app.init();
    repository = app.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(async () => {
    await repository.clear();
    await module.close();
  });

  describe('create', () => {
    const content = 'test';
    const createTaskDto = new CreateTaskDto();
    createTaskDto.content = content;

    it('should return a created task', async () => {
      const task = await service.create(createTaskDto);

      expect(task).toBeInstanceOf(Task);
      expect(task.content).toBe(content);
      expect(task.done).toBe(false);
    });
  });

  describe('findAll', () => {
    const count = 3;

    beforeEach(async () => {
      await Promise.all(
        [...Array(count)].map(() => {
          return repository.insert({ content: 'test' });
        }),
      );
    });

    it('should return an array of tasks', async () => {
      const tasks = await service.findAll();

      expect(tasks).toHaveLength(count);
      expect(tasks[0]).toBeInstanceOf(Task);
    });
  });

  describe('findOne', () => {
    beforeEach(async () => await repository.insert({ content: 'test' }));

    it('should return a task', async () => {
      const tasks = await repository.find();
      const { id } = tasks.pop();
      const task = await service.findOne(id);

      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe(id);
    });
  });

  describe('update', () => {
    const content = 'test';
    const done = true;
    const updateTaskDto = new UpdateTaskDto();
    updateTaskDto.content = content;
    updateTaskDto.done = done;

    beforeEach(async () => await repository.insert({ content: 'test' }));

    it('should return an updated task', async () => {
      const tasks = await repository.find();
      const { id } = tasks.pop();
      const task = await service.update(id, updateTaskDto);

      expect(task).toBeInstanceOf(Task);
      expect(task.id).toBe(id);
      expect(task.content).toBe(content);
      expect(task.done).toBe(done);
    });
  });

  describe('remove', () => {
    beforeEach(async () => await repository.insert({ content: 'test' }));

    it('should return true', async () => {
      const tasks = await repository.find();
      const { id } = tasks.pop();
      const succeed = await service.remove(id);

      expect(succeed).toBe(true);
    });
  });
});
