# url-shortener-service

## Description

A microservice that shortens long URLs into unique short links, resolves them back to their original destinations, supports URL creation and deletion, and was developed as a technical challenge.


## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Scripts](#scripts)
- [Docker Commands](#docker-commands)
- [License](#license)

## Prerequisites

- Node.js (>= 20.x)
- npm (>= 6.x)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd url-shortener-service
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Usage

### Development

To start the development server:

```sh
npm run start:dev
```

### Production

To build the project:

```sh
npm run build
```

To start the production server:

```sh
npm start
```

### Testing

To run tests:

```sh
npm test
```

## Scripts

- `start:dev`: Starts the development server with hot-reloading.
- `build`: Compiles TypeScript to JavaScript and replaces paths.
- `start`: Starts the production server.
- `lint`: Lints the code using ESLint.
- `lint:fix`: Fixes linting issues using ESLint.
- `test`: Runs tests using Jest.
- `test:watch`: Runs tests in watch mode.
- `format`: Formats the code using Prettier.
- `check-format`: Checks if the code is formatted using Prettier.
- `clean`: Removes the build directory.
- `purge`: Removes the node_modules directory and clears the npm cache.
- `prepare`: Installs Husky hooks.

## Docker Commands

### Build the Docker image

```sh
# Build the Docker image
docker build -t url-shortener-service .

# Run the Docker image
docker run -d --name url-shortener-container -p 8080:8080 url-shortener-service

# Check the logs
docker logs url-shortener-container

# Stop and remove the container
docker stop url-shortener-container
docker rm url-shortener-container
```

## License

This project is licensed under the MIT License.
