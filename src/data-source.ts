import { DataSource } from 'typeorm';
import { DATA_SOURCE_OPTIONS } from './config';
import { Task } from './tasks/entities/task.entity';

export const DataSourceOptions = {
  ...DATA_SOURCE_OPTIONS,
  entities: [Task],
};
export const AppDataSource = new DataSource(DataSourceOptions);
