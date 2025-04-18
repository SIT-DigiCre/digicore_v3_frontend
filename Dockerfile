FROM node:22

WORKDIR /core3
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install
COPY . .
RUN pnpm build
CMD pnpm start
