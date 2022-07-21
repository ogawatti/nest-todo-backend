import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSourceOptions } from './data-source';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(DataSourceOptions), TasksModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
