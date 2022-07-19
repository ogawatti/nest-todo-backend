import { DataSourceOptions } from 'typeorm';

export const DATA_SOURCE_OPTIONS: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'passwd',
  database: `nest_todo_${process.env.NODE_ENV || 'development'}`,
  charset: 'utf8mb4',
  synchronize: process.env.NODE_ENV != 'production',
  logging: false,
  migrations: [`${__dirname}/migrations/*.ts`],
  subscribers: [],
};
