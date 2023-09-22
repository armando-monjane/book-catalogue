# Book Catalogue

This is a simple web app developed using Node.js, Express, SQL Server and Prisma for the backend and React + Material UI for the frontend.
Both frontend and backend are developed using typescript.

## Setup
This section explains how to get the app running. In order to run the app on your development environment you need to get [Docker and docker compose](https://docs.docker.com/get-docker/) installed first.

### 1. Start all containers by executing `docker compose up` or `docker compose up -d` (will dispose after command finished) from the project root directory

### 2. Having all containers up and running, if running the app for the first time, run the migration to create the datbase by executing `cd backend && make migrate`

### 3. The app should be ready to access at [localhost:3000](http:localhost:3000]

 ## Backend
 The backend should be available at [localhost:5000/api](http:localhost:5000/api]

 ## Frontend
 The frontend should be available at [localhost:3000](http:localhost:3000/api]