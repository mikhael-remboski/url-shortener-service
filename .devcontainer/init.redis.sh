#!/bin/bash

REDIS_HOST="localhost"
REDIS_PORT="6379"

echo "Initializing Redis as a cache..."

echo "Setting max memory to 256MB and policy to allkeys-lru..."
redis-cli -h $REDIS_HOST -p $REDIS_PORT CONFIG SET maxmemory 256mb
redis-cli -h $REDIS_HOST -p $REDIS_PORT CONFIG SET maxmemory-policy allkeys-lru

echo "Testing Redis connection..."
if redis-cli -h $REDIS_HOST -p $REDIS_PORT ping | grep -q "PONG"; then
    echo "Redis is up and running."
else
    echo "Error: Redis is not reachable at $REDIS_HOST:$REDIS_PORT"
    exit 1
fi

echo "Redis initialized successfully as a cache."
