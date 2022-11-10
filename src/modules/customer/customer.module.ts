import { DeleteCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../../lib/database/document';
import { TABLE_NAME } from '../constants.module';
import { Transaction } from '../transaction/transaction.module';

export class Customer {
  customerId: undefined | string;
  plateNumber: string;
  vehicleSize: string;
  entryName: string;
  customerStatus: string;
  transactions: Transaction[];
  constructor(
    plateNumber: string,
    customerId: undefined | string,
    vehicleSize: string,
    entryName: string,
    customerStatus: string,
    transactions: Transaction[]
  ) {
    this.customerId = customerId === undefined ? uuidv4() : customerId;
    this.plateNumber = plateNumber;
    this.vehicleSize = vehicleSize;
    this.entryName = entryName;
    this.customerStatus = customerStatus;
    this.transactions = transactions;
  }
}

//==> FUNCTIONS FOR API METHODS <==//

//--> PUT / POST <--//
export const putCustomer = async (data: object) => {
  const params = {
    TableName: TABLE_NAME.customers,
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
export const getCustomer = async (
  plateNumber: string,
  customerId: undefined | string
) => {
  const params = {
    TableName: TABLE_NAME.customers,
    Key: {
      plateNumber: plateNumber,
      customerId: customerId,
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
export const deleteCustomer = async (
  plateNumber: string,
  customerId: undefined | string
) => {
  const params = {
    TableName: TABLE_NAME.customers,
    Key: {
      plateNumber: plateNumber,
      customerId: customerId,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Success - Item deleted');
  } catch (error) {
    console.log('Error', error);
  }
};
