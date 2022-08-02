import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from '../data-source';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let module: TestingModule;

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
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
