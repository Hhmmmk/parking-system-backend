import { format } from 'date-fns';
import { IncomingMessage, ServerResponse } from 'http';
import {
  queryCustomersTable,
  queryParkingSlotsTable,
  queryParkingZonesTable,
  queryTransactionsTable,
} from '../../lib/database/query';
import {
  CUSTOMER_STATUS,
  SLOT_STATUS,
  TABLE_NAME,
} from '../../modules/constants.module';
import {
  Customer,
  deleteCustomer,
  getCustomer,
  putCustomer,
} from '../../modules/customer/customer.module';
import {
  findSlotAssignment,
  getAdjacentZones,
  putParkingSlots,
  Slot,
} from '../../modules/parking/slot.module';
import { Zoning } from '../../modules/parking/zone.module';
import {
  deleteTransaction,
  putTransaction,
  Transaction,
} from '../../modules/transaction/transaction.module';
import {
  getJSONDataFromRequestStream,
  getId,
} from '../../utils/generateParams.utils';

export const addDate = () => {
  return format(new Date(), 'MM/dd/yy/p');
};

export const customerRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const customerId = getId(req);
  switch (req.method) {
    case 'POST':
      const postResult = (await getJSONDataFromRequestStream(req)) as {
        zoningName: string;
        plateNumber: string;
        customerId: string;
        vehicleSize: string;
        entryName: string;
        customerStatus: string;
      };

      const newCustomer = new Customer(
        postResult.plateNumber,
        undefined,
        postResult.vehicleSize,
        postResult.entryName,
        postResult.customerStatus,
        []
      );

      const activeZoning = (await queryParkingZonesTable(
        TABLE_NAME.parkingZones,
        postResult.zoningName
      )) as Zoning[];

      const priorityZone = activeZoning[0].zones.filter((zone) => {
        return zone.entryName === newCustomer.entryName;
      });

      const adjacentZones = getAdjacentZones(
        newCustomer,
        activeZoning[0].zones
      );

      const slotAssignment = (await findSlotAssignment(
        newCustomer,
        priorityZone[0],
        adjacentZones
      )) as Slot;

      const assignedSlot = (await queryParkingSlotsTable(
        TABLE_NAME.parkingSlots,
        slotAssignment.slotName
      )) as Slot[];

      const newTransaction = new Transaction(
        newCustomer.plateNumber,
        undefined,
        newCustomer.entryName,
        slotAssignment.slotName,
        addDate(),
        ''
      );

      console.log('assignedSlot: ', assignedSlot);

      const updatedSlot = {
        ...assignedSlot[0],
        slotStatus: SLOT_STATUS.occupied,
        customerDetails: {
          ...newCustomer,
        },
      };

      putCustomer(newCustomer);
      putTransaction(newTransaction);
      putParkingSlots(updatedSlot);

      console.log('NEW CUSTOMER: ', newCustomer);
      console.log('NEW TRANSACTION: ', newTransaction);
      console.log('ASSIGNED SLOT: ', updatedSlot);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully added new Customer to the database';

    case 'PUT':
      const putResult = (await getJSONDataFromRequestStream(req)) as {
        plateNumber: string;
        customerStatus: string;
      };

      const customer = (await queryCustomersTable(
        TABLE_NAME.customers,
        putResult.plateNumber
      )) as Customer[];

      const transaction = (await queryTransactionsTable(
        TABLE_NAME.transactions,
        putResult.plateNumber
      )) as Transaction[];

      if (
        customer[0].customerStatus !== putResult.customerStatus &&
        putResult.customerStatus === CUSTOMER_STATUS.tempUnparked
      ) {
        const updatedTransactionData = {
          ...transaction[0],
          exitTime: addDate(),
        };

        const updatedCustomerData = {
          ...customer[0],
          customerStatus: putResult.customerStatus,
          transactions: [...customer[0].transactions, updatedTransactionData],
        };

        //computation

        putTransaction(updatedTransactionData);
        putCustomer(updatedCustomerData);

        console.log('New Customer Data: ', updatedCustomerData);
        console.log('New Transaction Data: ', updatedTransactionData);

        const deleteTempUnparked = async () => {
          deleteTransaction(
            updatedTransactionData.plateNumber,
            updatedTransactionData.transactionId
          );

          const assignedSlot = (await queryParkingSlotsTable(
            TABLE_NAME.parkingSlots,
            updatedTransactionData.slotName
          )) as Slot[];

          const updatedSlot = {
            ...assignedSlot[0],
            slotStatus: SLOT_STATUS.available,
            customerDetails: {},
          };

          putParkingSlots(updatedSlot);

          console.log('Updated Slot: ', updatedSlot);
          console.log('Transaction Deleted');
        };

        setTimeout(deleteTempUnparked, 3900000);
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully updated Customer data on the database';

    case 'GET':
      const getResult = (await getJSONDataFromRequestStream(req)) as {
        plateNumber: string;
      };

      getCustomer(getResult.plateNumber, customerId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully retrieved Customer data from database';

    case 'DELETE':
      const deleteResult = (await getJSONDataFromRequestStream(req)) as {
        plateNumber: string;
      };

      deleteCustomer(deleteResult.plateNumber, customerId);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully deleted Customer data from database';

    default:
      break;
  }

  return `Customer Request: ${req.method}`;
};
