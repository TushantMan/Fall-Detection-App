# Fall Detection App

The Fall Detection App is designed to detect falls using sensor data and provide necessary alerts. This app is built using a multi-service architecture, including both frontend and backend components.

## Getting Started

Follow the instructions below to build and run the app using Docker.

### Prerequisites

- Ensure Docker is installed on your system. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

### Building and Running the Application

To build the application from scratch, navigate to the main directory of the project and use the following command:

```bash
docker compose up --build
```

### Example:

```bash
user@User-MacBook-Pro Fall-Detection-App % docker compose up --build
```
This command will build both the frontend and the backend components of the app.

If you only want to build and run the frontend and API components without rebuilding them, use:

```bash
docker compose up
```

### Stopping and Removing Containers
To stop and remove all containers created by Docker Compose, use the following command:

```bash
docker compose down
```

