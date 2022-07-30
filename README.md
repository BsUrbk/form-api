
# form-api

Simple API for user registration and user login with JWT authentication.


## Stack

[Express.js](https://expressjs.com/)

[TypeScript](https://www.typescriptlang.org/)

[Prisma](https://www.prisma.io/)

[Docker](https://www.docker.com/)
## Deployment

Initialize dockerized database

Use .env.example file to create your own .env file

```bash
  docker compose up
```

Install

```bash
  npm install
```
Create prisma

```bash
  npx prisma generate
  npx prisma migrate dev
  npx prisma db seed
  npx prisma db push
```

Run the api (dev)

```bash
  npm run dev
```
Or build it

```bash
  npm run build
  non run start
```


## Authors

- [@BsUrbk](https://www.github.com/BsUrbk)

