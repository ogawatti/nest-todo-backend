# NestJS TODO Backend Application

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build

```bash
$ docker build . -t nest-todo-backend
```

### Running the app with production mode on Docker at local

#### Start

```bash
$ docker run --rm \
             -p 3000:80 \
             --env DB_HOST=db \
             --env DB_USERNAME=root \
             --env DB_PASSWORD=passwd \
             --network docker-database_default \
             nest-todo-backend
```

#### Stop

```bash
$ dokcer ps
$ docker stop CONTAINER_ID
```
