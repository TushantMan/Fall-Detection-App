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
# Checking the Services

To check if your frontend and backend services are running after starting Docker, follow these steps:

### 1. Open your browser:
- **Frontend**: Go to [http://localhost:3000](http://localhost:3000)
- **Backend/API**: Go to [http://localhost:5001](http://localhost:5001)

### 2. Check the Response:
- If both URLs load correctly, your services are running as expected.
- If you see any errors (like "This site can't be reached"), it means the service is not running.

### 3. Using the Terminal:
- You can also use `curl` or `wget` to check if the services are up:
  ```bash
  curl -I http://localhost:3000
  curl -I http://localhost:5001
  ```
- A successful response should return an HTTP status code like `200 OK`.

### 4. Docker Commands:
- You can check the status of your Docker containers using:
  ```bash
  docker ps
  ```
- Ensure your frontend and backend containers are listed and running.

By following these steps, you can verify if your services are running correctly after starting Docker.