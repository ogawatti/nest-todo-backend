import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Task } from '../src/tasks/entities/task.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceOptions } from '../src/data-source';
import { TasksModule } from '../src/tasks/tasks.module';
import { TasksService } from '../src/tasks/tasks.service';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TasksModule,
        TypeOrmModule.forRoot(DataSourceOptions),
        TypeOrmModule.forFeature([Task]),
      ],
      providers: [TasksService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    repository = app.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(async () => {
    await repository.clear();
    await app.close();
  });

  describe('POST /api/tasks', () => {
    describe('with correct body', () => {
      const content = 'test';
      const requestBody = JSON.stringify({ content });
      const responseBody = JSON.stringify({ id: 1, content, done: false });

      it('return 201 created', async () => {
        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(201)
          .expect(responseBody);
      });
    });

    const badRequest = (requestBody) => {
      return request(app.getHttpServer())
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send(requestBody)
        .expect(400);
    };

    describe('with incontent body', () => {
      describe('that is empty', () => {
        const requestBody = JSON.stringify({});

        it('return 400 bad request', () => badRequest(requestBody));
      });

      describe('that content is empty string', () => {
        const content = '';
        const requestBody = JSON.stringify({ content });

        it('return 400 bad request', () => badRequest(requestBody));
      });

      describe('that content is too long', () => {
        const length = 256;
        const content = [...Array(length)].map(() => 'a').join('');
        const requestBody = JSON.stringify({ content });

        it('return 400 bad request', () => badRequest(requestBody));
      });
    });

    describe('without body', () => {
      it('return 400 bad request', () => {
        return request(app.getHttpServer())
          .post('/api/tasks')
          .set('Content-Type', 'application/json')
          .expect(400);
      });
    });
  });

  describe('GET /api/tasks', () => {
    const count = 3;

    beforeEach(async () => {
      return Promise.all(
        [...Array(count)].map(() => {
          return repository.insert({ content: 'test' });
        }),
      );
    });

    it('return 200 ok', async () => {
      const tasks = await repository.find();
      const responseBody = JSON.stringify(tasks);

      return request(app.getHttpServer())
        .get('/api/tasks')
        .expect(200)
        .expect(responseBody);
    });
  });

  describe('GET /api/tasks/:id', () => {
    describe('when specified task exists', () => {
      beforeEach(async () => await repository.insert({ content: 'test' }));

      it('return 200 ok', async () => {
        const tasks = await repository.find();
        const task = tasks.pop();
        const responseBody = JSON.stringify(task);

        return request(app.getHttpServer())
          .get(`/api/tasks/${task.id}`)
          .expect(200)
          .expect(responseBody);
      });
    });

    describe('when specified task does not exist', () => {
      it('return 404 not found', () => {
        return request(app.getHttpServer()).get(`/api/tasks/1`).expect(404);
      });
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    describe('with correct body', () => {
      const content = 'test';
      const done = true;
      const requestBody = JSON.stringify({ content, done });

      describe('when specified task exists', () => {
        beforeEach(async () => await repository.insert({ content: 'test' }));

        it('return 200 ok', async () => {
          const tasks = await repository.find();
          const task = tasks.pop();
          const responseBody = JSON.stringify({ id: task.id, content, done });

          return request(app.getHttpServer())
            .patch(`/api/tasks/1`)
            .set('Content-Type', 'application/json')
            .send(requestBody)
            .expect(200)
            .expect(responseBody);
        });
      });

      describe('when specified task does not exists', () => {
        it('return 404 not found', () => {
          return request(app.getHttpServer())
            .patch(`/api/tasks/1`)
            .set('Content-Type', 'application/json')
            .send(requestBody)
            .expect(404);
        });
      });
    });

    describe('with incorrect body', () => {
      const badRequest = (requestBody) => {
        return request(app.getHttpServer())
          .patch(`/api/tasks/1`)
          .set('Content-Type', 'application/json')
          .send(requestBody)
          .expect(400);
      };

      describe('that is empty', () => {
        const requestBody = JSON.stringify({});

        it('return 400 bad request', () => badRequest(requestBody));
      });

      describe('that content is empty string', () => {
        const content = '';
        const requestBody = JSON.stringify({ content });

        it('return 400 bad request', () => badRequest(requestBody));
      });

      describe('that content is too long', () => {
        const length = 256;
        const content = [...Array(length)].map(() => 'a').join('');
        const requestBody = JSON.stringify({ content });

        it('return 400 bad request', () => badRequest(requestBody));
      });

      describe('that done is not boolean', () => {
        const done = 'yet';
        const requestBody = JSON.stringify({ done });

        it('return 400 bad request', () => badRequest(requestBody));
      });
    });

    describe('without body', () => {
      it('return 400 bad request', () => {
        return request(app.getHttpServer())
          .patch(`/api/tasks/1`)
          .set('Content-Type', 'application/json')
          .expect(400);
      });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    describe('when specified task exists', () => {
      beforeEach(async () => await repository.insert({ content: 'test' }));

      it('return 204 no content', async () => {
        const tasks = await repository.find();
        const task = tasks.pop();
        const responseBody = {};

        return request(app.getHttpServer())
          .delete(`/api/tasks/${task.id}`)
          .expect(204)
          .expect(responseBody);
      });
    });

    describe('when specified task does not exist', () => {
      it('return 404 not found', () => {
        return request(app.getHttpServer()).delete(`/api/tasks/1`).expect(404);
      });
    });
  });
});
