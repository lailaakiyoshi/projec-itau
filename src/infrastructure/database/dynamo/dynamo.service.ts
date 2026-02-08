import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoService {
  client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });
}
