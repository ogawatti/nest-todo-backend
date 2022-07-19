FROM node:16-bullseye-slim

RUN apt update \
  && apt upgrade -y \
  && apt install -y default-mysql-client

WORKDIR /app

COPY . .
RUN yarn

ENV APP_PORT 80
ENV NODE_ENV=production
RUN yarn build

EXPOSE 80
CMD /app/bin/entrypoint
