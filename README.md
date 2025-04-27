# CEMA SE Task – Basic Health Information System Backend

This project implements a backend system for managing clients and their enrollment in various health programs (e.g., HIV, TB, Malaria). It demonstrates clean architecture principles using TypeScript, Express.js, and Prisma ORM with PostgreSQL.

# 🔗 Project Links

---

|                                                          Link                                                           | Description                |
| :---------------------------------------------------------------------------------------------------------------------: | :------------------------- |
|                                    🌐 [Live Website](https://cemasystem.vercel.app)                                     | Visit the deployed project |
|                             📚 [API Documentation](https://cemasystem.vercel.app/api-docs)                              | Explore the API endpoints  |
| 🎤 [Presentation](https://docs.google.com/presentation/d/1CWhjayWJKWvvWRca8X6KXrs4F14mfR4xaur6P8TPWCw/edit?usp=sharing) | View project presentation  |
|           🎥 [Video Demo](https://drive.google.com/file/d/19CTpUJV7c8-Z1nGFRVsmE0Y64AzhBk3I/view?usp=sharing)           | Watch the demo             |
|                                🖥️ [Backend Repo](https://github.com/Imukua/cema-se-task)                                | See the backend code       |
|                          💻 [Frontend Repo](https://github.com/Imukua/cema-se-task/tree/main)                           | See the frontend code      |

---

---

## 🧩 Features

- **User Management**: Registration, login, and token-based authentication.
- **Client Management**: Create, search, update, and delete client records.
- **Health Programs**: CRUD operations for health programs.
- **Enrollment System**: Link clients to programs with status tracking.
- **Authentication**: JWT-based secured routes.
- **Validation**: Strong request validation using Zod.
- **Logging & Monitoring**: Morgan + Winston setup for error and access logs.
- **Pagination & Filtering**: For scalable data queries.
- **RESTful API**: Designed for easy integration.

---

## 🏗️ Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (Passport.js)
- **Dev Tools**: Husky, Lint-Staged, ESLint, Prettier, PM2

---

## 📁 Project Structure

```

src/
├── config/ # Environment, logging, middleware configs
├── controllers/ # Route controllers
├── middleware/ # Auth and validation middlewares
├── routes/ # Versioned API routes
├── services/ # Business logic
├── types/ # Zod schemas and TypeScript types
├── utils/ # Error handling, async helpers
├── db.client.ts # Prisma client setup
├── app.ts # Express app setup
└── index.ts # Entry point

```

---

## 🔧 Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)
- A `.env` file configured (see below)

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory based on `.env.example`:

```

NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=30

```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Imukua/cema-se-task.git
cd cema-se-task
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up the database

Ensure PostgreSQL is running and the `DATABASE_URL` is correctly set.

```bash
yarn db:push
```

This will run the migrations and generate the Prisma client.

### 4. Start the development server

```bash
yarn dev
```

The server will start on `http://localhost:3000`.

---

## 🏁 Production Start

Build and run using PM2:

```bash
yarn start
```

This will compile TypeScript and launch the server using PM2.

---

## 🧪 API Overview

All routes are prefixed with `/v1`

### 🔐 Auth

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`

### 👤 Users

- `GET /v1/users`
- `GET /v1/users/:id`
- `PATCH /v1/users/:id`
- `DELETE /v1/users/:id`

### 🧍 Clients

- `POST /v1/clients`
- `GET /v1/clients`
- `GET /v1/clients/:id`
- `PATCH /v1/clients/:id`
- `DELETE /v1/clients/:id`

### 🩺 Health Programs

- `POST /v1/programs`
- `GET /v1/programs`
- `GET /v1/programs/:id`
- `PATCH /v1/programs/:id`
- `DELETE /v1/programs/:id`

### 🧾 Enrollments

- `POST /v1/enrollments`
- `GET /v1/enrollments/client/:clientId`
- `PATCH /v1/enrollments/:id`
- `DELETE /v1/enrollments/:id`

> ⚠️ Most routes are protected. Use the access token in the `Authorization: Bearer <token>` header.

---

## 🧹 Code Quality

- `yarn lint` - run ESLint
- `yarn lint:fix` - fix lint issues
- `yarn prettier` - check formatting
- `yarn prettier:fix` - format code
- Git hooks ensure formatting and linting on commit

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

## 🙌 Author

Made with ❤️ by [Imukua](https://github.com/Imukua)

```

---

Let me know if you'd like this in a downloadable file or want sections like **API examples**, **OpenAPI docs**, or **database diagrams** added.
```
