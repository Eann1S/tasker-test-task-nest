# Tasker: RESTful API for Task Management

## Overview

**Tasker** is a RESTful API for managing tasks, built using an **Nx monorepo** setup with **NestJS** and **Sequelize (PostgreSQL)**. This project allows users to create and manage tasks, add comments, assign responsibilities, and track tasks by status. It includes comprehensive functionality to meet the outlined requirements and has been containerized using Docker for easy deployment and testing.

---

## Features

### Core Features
- **User Management**: 
  - Create users.

- **Task Management**:
  - Create tasks (associated with the user who created them).
  - Update task title and description (only by the creator).
  - Delete tasks (only by the creator).
  - Assign a responsible user during task creation.
  - Change the task status (by creator or responsible user).
  - Assign observers to a task.
  - Add comments to tasks (comments are associated with the user who posted them).

- **Task Retrieval**:
  - Get tasks where a user is assigned as responsible.
  - Get tasks where a user is assigned as an observer.
  - Get tasks filtered by status.
  - Get all tasks.
  - Get detailed task information by ID.

### Additional Features
- **Dockerized Deployment**:
  - Docker image and `docker-compose` file provided for streamlined setup.
- **Swagger Documentation**:
  - Built-in Swagger docs to explore and test the API.
- **End-to-End Tests**:
  - Comprehensive e2e tests covering all primary logic.

---

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with Sequelize ORM
- **Monorepo Tool**: [Nx](https://nx.dev/)
- **Authentication**: JWT-based authentication
- **Containerization**: Docker
- **Testing**: Jest (e2e tests)

---

## Installation and Setup

### Prerequisites
- Docker and Docker Compose installed.
- `.env` file configured with the following variables:
  ```env
  PORT=5000
  POSTGRES_USER=<your_postgres_user>
  POSTGRES_PASSWORD=<your_postgres_password>
  POSTGRES_DB=<your_database_name>
  DB_HOST=<db_host>
  DB_HOST=<db_port>
  JWT_SECRET=<your_jwt_secret>
  JWT_EXP=<jwt_expiration_time_in_seconds>
  ```

### Steps to Run
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd tasker
   ```

2. **Start the Application**:
   Use Docker Compose to build and run the services.
   ```bash
   docker-compose up --build
   ```

3. **Access the API**:
   - Swagger documentation: `http://localhost:5000/api`

---

## API Endpoints

All endpoints are documented in Swagger at `/api`. Below is a summary of key endpoints:

### User Endpoints
- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate a user and get a JWT token.

### Task Endpoints
- **POST** `/tasks`: Create a new task.
- **PUT** `/tasks/:id`: Update task title or description.
- **DELETE** `/tasks/:id`: Delete a task.
- **PUT** `/tasks/:id/status`: Update task status.
- **GET** `/tasks`: Get all tasks.
- **GET** `/tasks/:id`: Get detailed information about a task.

### Comments Endpoints
- **POST** `/comments/task/:taskId`: Add a comment to a task.
- **DELETE** `/comments/:id`: Delete a comment.

---

## Docker Setup

### Services
- **App**: Runs the NestJS application.
- **DB**: PostgreSQL database instance.

---

### Test Coverage
- Task creation and updates
- User association with tasks
- Commenting on tasks
- Task retrieval (by status, responsibilities, observers, etc.)
