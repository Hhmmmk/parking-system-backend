import { v4 as uuidv4 } from 'uuid';

import { docClient } from '../../lib/database/document';
import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

import { TABLE_NAME } from '../constants.module';

//==> TRANSACTION CLASS <==//

export class Transaction {
  plateNumber: string;
  transactionId: undefined | string;
  entryName: string;
  slotName: string;
  entryTime: string;
  exitTime: string;
  constructor(
    plateNumber: string,
    transactionId: undefined | string,
    entryName: string,
    slotName: string,
    entryTime: string,
    exitTime: string
  ) {
    this.plateNumber = plateNumber;
    this.transactionId = transactionId === undefined ? uuidv4() : transactionId;
    this.entryName = entryName;
    this.slotName = slotName;
    this.entryTime = entryTime;
    this.exitTime = exitTime;
  }
}

//==> FUNCTIONS FOR API METHODS <==//

//--> PUT / POST <--//
export const putTransaction = async (data: object) => {
  const params = {
    TableName: TABLE_NAME.transactions,
    Item: { ...data },
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    console.log('Success - Item added or updated', data);
  } catch (error) {
    console.log('ERROR', error);
  }
};

//--> GET <--//
export const getTransaction = async (
  plateNumber: string,
  transactionId: undefined | string
) => {
  const params = {
    TableName: TABLE_NAME.transactions,
    Key: {
      plateNumber: plateNumber,
      transactionId: transactionId,
    },
  };
  try {
    const data = await docClient.send(new GetCommand(params));
    console.log('Success: ', data.Item);
  } catch (error) {
    console.log('ERROR', error);
  }
};

//--> DELETE <--//
export const deleteTransaction = async (
  plateNumber: string,
  transactionId: undefined | string
) => {
  const params = {
    TableName: TABLE_NAME.transactions,
    Key: {
      plateNumber: plateNumber,
      transactionId: transactionId,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Success - Item deleted');
  } catch (error) {
    console.log('Error', error);
  }
};
