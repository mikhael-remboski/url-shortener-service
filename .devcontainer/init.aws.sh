#!/bin/bash

TABLE_NAME="url-shortener"
PARTITION_KEY="id"

echo "Creating DynamoDB table: $TABLE_NAME with on-demand capacity mode"
aws dynamodb create-table \
    --endpoint-url=http://localhost:4566 \
    --table-name $TABLE_NAME \
    --attribute-definitions \
        AttributeName=$PARTITION_KEY,AttributeType=S \
    --key-schema \
        AttributeName=$PARTITION_KEY,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

echo "DynamoDB table created successfully with on-demand capacity mode."
