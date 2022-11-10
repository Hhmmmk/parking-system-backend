import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { dbClient } from '../client/dynamo';

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: false,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

const docClient = DynamoDBDocumentClient.from(dbClient, translateConfig);

export { docClient };
