# Todo API

A RESTful Todo API built with Node.js, Express, TypeScript, MongoDB, and Redis. The application can be run inside Docker containers using either Docker CLI or Docker Compose.

## Frontend Links

- **GitHub Pages:** https://eugenekime.github.io/react-3.9/
- **Frontend Repository:** https://github.com/Eugenekime/react-3.9

> First, start the backend server. Then open the GitHub Pages link to use the frontend.

To view the frontend source code, visit the GitHub repository.

## Tech Stack

- Node.js 22
- Express
- TypeScript
- MongoDB Atlas
- Redis
- Docker
- Docker Compose

## Prerequisites

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- A MongoDB database (MongoDB Atlas or a local MongoDB instance)

## Environment Variables

Create a `.env` file in the root directory of the project:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/todo-api
REDIS_URL=redis://localhost:6379
```

Replace `USERNAME` and `PASSWORD` with your MongoDB Atlas credentials.

`REDIS_URL` specifies the address where the Redis server is running.

## Redis Setup

Redis is used for caching Todo data to reduce unnecessary database queries and improve API performance.

Before starting the API, Redis must be running.

### 1. Start Redis using Docker

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

This command:

- Downloads the Redis image if it is not available locally.
- Creates a Redis container named `redis`.
- Runs Redis in the background.
- Maps port `6379` from the container to port `6379` on the host machine.

### 2. Check if Redis is running

```bash
docker ps
```

You should see the Redis container in the list of running containers.

### 3. Test the Redis connection

```bash
docker exec -it redis redis-cli ping
```

Expected response:

```text
PONG
```

If Redis returns `PONG`, the Redis server is running and ready to accept connections.

### 4. Redis connection URL

When the API runs directly on your computer:

```env
REDIS_URL=redis://localhost:6379
```

When the API runs inside Docker Compose, it should use the Redis service name instead of `localhost`:

```env
REDIS_URL=redis://redis:6379
```

## Running Without Docker Compose

### 1. Build the Docker image

```bash
docker build -t todo-api .
```

### 2. Start Redis

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 3. Run the API container

```bash
docker run -d \
  --name todo-api \
  -p 3000:3000 \
  --env-file .env \
  todo-api
```

### 4. Check the container status

```bash
docker ps
```

### 5. View application logs

```bash
docker logs -f todo-api
```

### 6. Stop the containers

```bash
docker stop todo-api redis
```

### 7. Remove the containers

```bash
docker rm todo-api redis
```

## Running With Docker Compose

Docker Compose provides an easier way to build, start, and manage the API and Redis containers together.

### 1. Build and start the services

```bash
docker compose up --build -d
```

This starts both the API and Redis containers.

### 2. Check the services

```bash
docker compose ps
```

### 3. View API logs

```bash
docker compose logs -f api
```

### 4. View Redis logs

```bash
docker compose logs -f redis
```

### 5. Stop the services

```bash
docker compose stop
```

### 6. Start the services again

```bash
docker compose start
```

### 7. Stop and remove the containers

```bash
docker compose down
```

## API Health Check

The application provides a health check endpoint:

```http
GET /health
```

Example:

```bash
curl http://localhost:3000/health
```

## API Base URL

When running locally with Docker:

```text
http://localhost:3000
```

## Docker Commands

| Command                                                               | Description                           |
| --------------------------------------------------------------------- | ------------------------------------- |
| `docker build -t todo-api .`                                          | Build the API image                   |
| `docker run -d --name redis -p 6379:6379 redis:7-alpine`              | Start Redis                           |
| `docker run -d --name todo-api -p 3000:3000 --env-file .env todo-api` | Run the API container                 |
| `docker ps`                                                           | List running containers               |
| `docker logs -f todo-api`                                             | View API logs                         |
| `docker exec -it redis redis-cli ping`                                | Test Redis connection                 |
| `docker stop todo-api redis`                                          | Stop containers                       |
| `docker rm todo-api redis`                                            | Remove containers                     |
| `docker compose up --build -d`                                        | Build and start services with Compose |
| `docker compose ps`                                                   | Check service status                  |
| `docker compose logs -f api`                                          | View API logs                         |
| `docker compose logs -f redis`                                        | View Redis logs                       |
| `docker compose down`                                                 | Stop and remove Compose containers    |

## Notes

- Environment variables are provided through the `.env` file.
- The `.env` file should not be committed to Git.
- MongoDB Atlas is used as the database.
- Redis is used for caching Todo data.
- Redis must be running before the API starts when running outside Docker Compose.
- Docker Compose simplifies container management by running the API and Redis together.
- The application runs on port `3000`.
- Redis uses port `6379.
