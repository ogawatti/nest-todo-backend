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

### Running the app on Docker

#### Start

```bash
$ docker run -p 3000:80 --rm nest-todo-backend
```

#### Stop

```bash
$ dokcer ps
$ docker stop CONTAINER_ID
```
