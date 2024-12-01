### README to Start AWS DynamoDB and Redis

#### Prerequisites
- Docker
- Docker Compose
- AWS CLI
- Redis CLI

#### Steps to Start AWS DynamoDB and Redis

1. **Start Docker Containers**
   ```sh
   docker-compose up -d
   ```

2. **Initialize AWS DynamoDB**
   ```sh
   ./init.aws.sh
   ```

3. **Initialize Redis config**
   ```sh
   ./init.redis.sh
   ```

4. **Verify Services**
    - **DynamoDB**: Check if the table is created using AWS CLI or AWS Management Console.
    - **Redis**: Run `redis-cli -h localhost -p 6379 ping` and ensure it returns `PONG`.

#### Notes
- Ensure Docker is running before starting the containers.
- The `docker-compose.yml` file sets up LocalStack for AWS services and a Redis container.
- The initialization scripts configure the services as required.