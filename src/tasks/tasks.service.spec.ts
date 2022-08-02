import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from '../data-source';
import { Task } from './entities/task.entity';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let module: TestingModule;

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
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
