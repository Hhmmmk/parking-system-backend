import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import { docClient } from './document';

//==> QUERY TABLE USING ENTRY NAME <==//

export const queryEntrancesTable = async (
  tableName: string,
  entryName: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#i = :i',
    ExpressionAttributeNames: { '#i': 'entryName' },
    ExpressionAttributeValues: {
      ':i': entryName,
    },
  };
  try {
    const data = await docClient.send(new QueryCommand(params));

    const dataList = data.Items?.map((item) => {
      return item;
    });

    return dataList;
  } catch (error) {
    console.log('Error', error);
  }
};

//==> QUERY TABLE USING ZONING ID <==//

export const queryParkingZonesTable = async (
  tableName: string,
  zoningName: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#i = :i',
    ExpressionAttributeNames: { '#i': 'zoningName' },
    ExpressionAttributeValues: {
      ':i': zoningName,
    },
  };
  try {
    const data = await docClient.send(new QueryCommand(params));

    const dataList = data.Items?.map((item) => {
      return item;
    });

    console.log(
      `RETRIEVED ${tableName.toLocaleUpperCase()} DETAILS: `,
      dataList
    );

    return dataList;
  } catch (error) {
    console.log('Error', error);
  }
};

//==> QUERY TABLE USING SLOT NAME <==//

export const queryParkingSlotsTable = async (
  tableName: string,
  slotName: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#s = :s',
    ExpressionAttributeNames: { '#s': 'slotName' },
    ExpressionAttributeValues: {
      ':s': slotName,
    },
  };
  try {
    const data = await docClient.send(new QueryCommand(params));

    const dataList = data.Items?.map((item) => {
      return item;
    });

    return dataList;
  } catch (error) {
    console.log('Error', error);
  }
};

//==> QUERY TABLE USING PLATE NUMBER <==//

export const queryTransactionsTable = async (
  tableName: string,
  plateNumber: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#i = :i',
    ExpressionAttributeNames: { '#i': 'plateNumber' },
    ExpressionAttributeValues: {
      ':i': plateNumber,
    },
  };
  try {
    const data = await docClient.send(new QueryCommand(params));

    const dataList = data.Items?.map((item) => {
      return item;
    });

    console.log(
      `RETRIEVED ${tableName.toLocaleUpperCase()} DETAILS: `,
      dataList
    );

    return dataList;
  } catch (error) {
    console.log('Error', error);
  }
};

export const queryCustomersTable = async (
  tableName: string,
  plateNumber: string
) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#i = :i',
    ExpressionAttributeNames: { '#i': 'plateNumber' },
    ExpressionAttributeValues: {
      ':i': plateNumber,
    },
  };
  try {
    const data = await docClient.send(new QueryCommand(params));

    const dataList = data.Items?.map((item) => {
      return item;
    });

    console.log(
      `RETRIEVED ${tableName.toLocaleUpperCase()} DETAILS: `,
      dataList
    );

    return dataList;
  } catch (error) {
    console.log('Error', error);
  }
};
