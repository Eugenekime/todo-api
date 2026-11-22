Frontend links
gh-page -> https://eugenekime.github.io/react-3.9/
gh-repo -> https://github.com/Eugenekime/react-3.9

first start the server, second click on gh-page link

To see a web-site code click on gh-repo link

# Todo API

A RESTful Todo API built with Node.js, Express, TypeScript, and MongoDB. The application can be run inside a Docker container using either Docker CLI or Docker Compose.

## Tech Stack

- Node.js 22
- Express
- TypeScript
- MongoDB Atlas
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
```

Replace `USERNAME` and `PASSWORD` with your MongoDB Atlas credentials.

## Running Without Docker Compose

### 1. Build the Docker image

```bash
docker build -t todo-api .
```

### 2. Run the container

```bash
docker run -d \
  --name todo-api \
  -p 3000:3000 \
  --env-file .env \
  todo-api
```

### 3. Check the container status

```bash
docker ps
```

### 4. View application logs

```bash
docker logs -f todo-api
```

### 5. Stop the container

```bash
docker stop todo-api
```

### 6. Remove the container

```bash
docker rm todo-api
```

## Running With Docker Compose

Docker Compose provides an easier way to build, start, and manage the application.

### 1. Build and start the application

```bash
docker compose up --build -d
```

### 2. Check the services

```bash
docker compose ps
```

### 3. View logs

```bash
docker compose logs -f api
```

### 4. Stop the application

```bash
docker compose stop
```

### 5. Start the application again

```bash
docker compose start
```

### 6. Stop and remove containers

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
| `docker build -t todo-api .`                                          | Build the Docker image                |
| `docker run -d --name todo-api -p 3000:3000 --env-file .env todo-api` | Run the container                     |
| `docker ps`                                                           | List running containers               |
| `docker logs -f todo-api`                                             | View container logs                   |
| `docker stop todo-api`                                                | Stop the container                    |
| `docker rm todo-api`                                                  | Remove the container                  |
| `docker compose up --build -d`                                        | Build and start services with Compose |
| `docker compose ps`                                                   | Check service status                  |
| `docker compose logs -f api`                                          | View API logs                         |
| `docker compose down`                                                 | Stop and remove Compose containers    |

## Notes

- Environment variables are provided through the `.env` file.
- The `.env` file should not be committed to Git.
- MongoDB Atlas is used as the database.
- Docker Compose simplifies container management and application startup.
- The application runs on port `3000`.
