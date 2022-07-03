
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

Run the installation

```bash
  npm install
```
Deploy the database

```bash
  npx prisma generate
  npx prisma migrate dev
  npx prisma db seed
  npx prisma db push
```

Run the api in dev mode

```bash
  npm run dev
```



## Authors

- [@BsUrbk](https://www.github.com/BsUrbk)

