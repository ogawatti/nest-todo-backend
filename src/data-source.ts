import { DataSource } from 'typeorm';
import { DATA_SOURCE_OPTIONS } from './config';
import { Task } from './tasks/entities/task.entity';
import { User } from './users/entities/user.entity';

export const DataSourceOptions = {
  ...DATA_SOURCE_OPTIONS,
  entities: [Task, User],
};
export const AppDataSource = new DataSource(DataSourceOptions);
