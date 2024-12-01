# mgrb-backend-template

## Description

A backend template built with Express and Node.js to accelerate the development process.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [Scripts](#scripts)
- [Docker Commands](#docker-commands)
- [License](#license)

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd mgrb-backend-template
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
docker build -t mgrb-backend-template .

# Run the Docker image
docker run -d --name mgrb-backend-container -p 8080:8080 mgrb-backend-template

# Check the logs
docker logs mgrb-backend-container

# Stop and remove the container
docker stop mgrb-backend-container
docker rm mgrb-backend-container
```

## License

This project is licensed under the MIT License.
