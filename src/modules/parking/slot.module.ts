import { DeleteCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../../lib/database/document';
import { queryParkingSlotsTable } from '../../lib/database/query';

import {
  SLOT_STATUS,
  SLOT_TYPES,
  TABLE_NAME,
  TOTALS,
} from '../constants.module';
import { Customer } from '../customer/customer.module';
import { Label } from '../types.module';
import { Zone } from './zone.module';

export class Slot {
  slotId: undefined | string;
  slotName: string;
  slotLabel: Label;
  size: string;
  slotStatus: string;
  customerDetails: {};
  constructor(
    slotId: undefined | string,
    slotName: string,
    slotLabel: Label,
    size: string,
    slotStatus: string,
    customerDetails: {}
  ) {
    this.slotId = slotId === undefined ? uuidv4() : slotId;
    this.slotName = slotName;
    this.slotLabel = slotLabel;
    this.size = size;
    this.slotStatus = slotStatus;
    this.customerDetails = customerDetails;
  }
}

export const generateParkingSlots = (size: string) => {
  const slots: Slot[] = [];

  switch (size) {
    case SLOT_TYPES.small:
      for (let i = 0; i < TOTALS.small; i++) {
        const slot = new Slot(
          undefined,
          `${SLOT_TYPES.small}_${i}`,
          [SLOT_TYPES.small, i],
          'small',
          SLOT_STATUS.available,
          {}
        );

        slots.push(slot);
      }

      return slots;

    case SLOT_TYPES.medium:
      for (let i = 0; i < TOTALS.medium; i++) {
        const slot = new Slot(
          undefined,
          `${SLOT_TYPES.medium}_${i}`,
          [SLOT_TYPES.medium, i],
          'medium',
          SLOT_STATUS.available,
          {}
        );

        slots.push(slot);
      }

      return slots;

    case SLOT_TYPES.large:
      for (let i = 0; i < TOTALS.large; i++) {
        const slot = new Slot(
          undefined,
          `${SLOT_TYPES.large}_${i}`,
          [SLOT_TYPES.large, i],
          'large',
          SLOT_STATUS.available,
          {}
        );

        slots.push(slot);
      }

      return slots;

    default:
      break;
  }

  return slots;
};

export const smallSlots = generateParkingSlots(SLOT_TYPES.small);
export const mediumSlots = generateParkingSlots(SLOT_TYPES.medium);
export const largeSlots = generateParkingSlots(SLOT_TYPES.large);

//==> FUNCTIONS FOR API METHODS <==/

//--> PUT / POST <--//
export const putParkingSlots = async (data: object) => {
  const params = {
    TableName: TABLE_NAME.parkingSlots,
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
export const getParkingSlot = async (slot: string) => {
  const parkingSlot = (await queryParkingSlotsTable(
    TABLE_NAME.parkingSlots,
    slot
  )) as Slot[];

  return parkingSlot;
};

export const getParkingSlots = async (size: string) => {
  const slots: Slot[] = [];

  switch (size) {
    case SLOT_TYPES.small:
      for (let i = 0; i < TOTALS.small; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.small}_${i}`
        )) as Slot[];

        slots.push(parkingSlot[0]);
      }

      return slots;

    case SLOT_TYPES.medium:
      for (let i = 0; i < TOTALS.medium; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.medium}_${i}`
        )) as Slot[];

        slots.push(parkingSlot[0]);
      }

      return slots;

    case SLOT_TYPES.large:
      for (let i = 0; i < TOTALS.large; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.large}_${i}`
        )) as Slot[];

        slots.push(parkingSlot[0]);
      }

      return slots;

    default:
      break;
  }

  return slots;
};

//--> DELETE <--//
export const deleteSlot = async (slotName: string) => {
  const params = {
    TableName: TABLE_NAME.parkingSlots,
    Key: {
      slotName: slotName,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Success - Item deleted');
  } catch (error) {
    console.log('Error', error);
  }
};

export const getAdjacentZones = (newCustomer: Customer, zones: Zone[]) => {
  const adjacentIndex: number[] = [];
  zones.forEach((zone, i) => {
    if (zone.entryName === newCustomer.entryName) {
      if (i === 0) {
        adjacentIndex.push(zones.length - 1);
        adjacentIndex.push(i + 1);
      } else if (i === zones.length - 1) {
        adjacentIndex.push(i - 1);
        adjacentIndex.push(0);
      } else {
        adjacentIndex.push(i - 1);
        adjacentIndex.push(i + 1);
      }
    }
  });

  const adjacentZones = zones.filter((zone, i) => {
    return i === adjacentIndex[0] || i === adjacentIndex[1];
  });

  return adjacentZones;
};

//outputing initial value instead of actual generated value
export const getAvailableSlots = async (slots: Slot[]) => {
  const parkingSlots: Slot[] = [];

  slots.forEach(async (slot, i) => {
    const parkingSlot = (await queryParkingSlotsTable(
      TABLE_NAME.parkingSlots,
      slot.slotName
    )) as Slot[];

    parkingSlots.push(parkingSlot[0]);

    if (i === slots.length - 1) {
      const availableSlots = parkingSlots.filter((slot) => {
        return slot.slotStatus === SLOT_STATUS.available;
      });

      return availableSlots;
    }

    return parkingSlots;
  });

  console.log('availableSlots: ', parkingSlots);
  return parkingSlots;
};

export const getSlotAssignment = async (
  newCustomer: Customer,
  priorityZone: Zone
) => {
  const { vehicleSize } = newCustomer;

  const slotAssignment: Slot[] = [];

  switch (vehicleSize) {
    case 'small':
      const availableSmallSlots = priorityZone.smallSlots.filter((slot) => {
        return slot.slotStatus === SLOT_STATUS.available;
      });

      if (availableSmallSlots.length) {
        if (
          priorityZone.entryName === 'entry_1' ||
          priorityZone.entryName === 'entry_2'
        ) {
          slotAssignment.push(
            availableSmallSlots[availableSmallSlots.length - 1]
          );
        } else {
          slotAssignment.push(availableSmallSlots[0]);
        }

        //set slotStatus to occupied
        //update slot customerDetails
      } else {
        const availableSlots = priorityZone.mediumSlots.filter((slot) => {
          return slot.slotStatus === SLOT_STATUS.available;
        });

        if (availableSlots.length) {
          if (
            priorityZone.entryName === 'entry_1' ||
            priorityZone.entryName === 'entry_2'
          ) {
            slotAssignment.push(availableSlots[availableSlots.length - 1]);
          } else {
            slotAssignment.push(availableSlots[0]);
          }
          //set slotStatus to occupied
          //update slot customerDetails
        } else {
          const availableSlots = priorityZone.largeSlots.filter((slot) => {
            return slot.slotStatus === SLOT_STATUS.available;
          });

          if (availableSlots.length) {
            if (
              priorityZone.entryName === 'entry_1' ||
              priorityZone.entryName === 'entry_2'
            ) {
              slotAssignment.push(availableSlots[availableSlots.length - 1]);
            } else {
              slotAssignment.push(availableSlots[0]);
            }
            //set slotStatus to occupied
            //update slot customerDetails
          }
        }
      }

      return slotAssignment;

    case 'medium':
      const availableMediumSlots = priorityZone.mediumSlots.filter((slot) => {
        return slot.slotStatus === SLOT_STATUS.available;
      });

      if (availableMediumSlots.length) {
        if (
          priorityZone.entryName === 'entry_1' ||
          priorityZone.entryName === 'entry_2'
        ) {
          slotAssignment.push(
            availableMediumSlots[availableMediumSlots.length - 1]
          );
        } else {
          slotAssignment.push(availableMediumSlots[0]);
        }

        //set slotStatus to occupied
        //update slot customerDetails
      } else {
        const availableSlots = priorityZone.largeSlots.filter((slot) => {
          return slot.slotStatus === SLOT_STATUS.available;
        });

        if (availableSlots.length) {
          if (
            priorityZone.entryName === 'entry_1' ||
            priorityZone.entryName === 'entry_2'
          ) {
            slotAssignment.push(availableSlots[availableSlots.length - 1]);
          } else {
            slotAssignment.push(availableSlots[0]);
          }
          //set slotStatus to occupied
          //update slot customerDetails
        }
      }

      return slotAssignment;

    case 'large':
      const availableLargeSlots = priorityZone.largeSlots.filter((slot) => {
        return slot.slotStatus === SLOT_STATUS.available;
      });

      if (availableLargeSlots.length) {
        if (
          priorityZone.entryName === 'entry_1' ||
          priorityZone.entryName === 'entry_2'
        ) {
          slotAssignment.push(
            availableLargeSlots[availableLargeSlots.length - 1]
          );
        } else {
          slotAssignment.push(availableLargeSlots[0]);
        }

        //set slotStatus to occupied
        //update slot customerDetails
      } else {
        const availableSlots = priorityZone.largeSlots.filter((slot) => {
          return slot.slotStatus === SLOT_STATUS.available;
        });

        if (availableSlots.length) {
          if (
            priorityZone.entryName === 'entry_1' ||
            priorityZone.entryName === 'entry_2'
          ) {
            slotAssignment.push(availableSlots[availableSlots.length - 1]);
          } else {
            slotAssignment.push(availableSlots[0]);
          }
          //set slotStatus to occupied
          //update slot customerDetails
        }
      }

      return slotAssignment;

    default:
      break;

    // case 'medium':
  }

  return 'Parking Zone Full'; // Proceed to closest zone
};

export const findSlotAssignment = async (
  newCustomer: Customer,
  priorityZone: Zone,
  adjacentZones: Zone[]
) => {
  const assignment = [];
  const slotAssignment = await getSlotAssignment(newCustomer, priorityZone);

  if (slotAssignment === 'Parking Zone Full') {
    const slotAssignment = await getSlotAssignment(
      newCustomer,
      adjacentZones[0]
    );

    if (slotAssignment === 'Parking Zone Full') {
      const slotAssignment = await getSlotAssignment(
        newCustomer,
        adjacentZones[1]
      );

      assignment.push(slotAssignment[0]);
    } else {
      assignment.push(slotAssignment[0]);
    }
  } else {
    assignment.push(slotAssignment[0]);
  }

  console.log('SLOT ASSIGNMENT: ', assignment);
  return assignment[0];
};
