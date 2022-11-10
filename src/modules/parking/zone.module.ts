import { DeleteCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient } from '../../lib/database/document';

import {
  SLOT_TYPES,
  TABLE_NAME,
  TOTALS,
  ZONING_RANGES,
  ZONING_STATUS,
} from '../constants.module';
import { Label, SlotRange } from '../types.module';
import {
  getParkingSlot,
  largeSlots,
  mediumSlots,
  Slot,
  smallSlots,
} from './slot.module';

export class Zoning {
  zoningId: undefined | string;
  zoningName: string;
  zoningLabel: Label;
  numberOfEntrances: number;
  zoningStatus: string;
  zones: Zone[];
  constructor(
    zoningName: string,
    zoningId: undefined | string,
    zoningLabel: Label,
    numberOfEntrances: number,
    zoningStatus: string,
    zones: Zone[]
  ) {
    this.zoningId = zoningId === undefined ? uuidv4() : zoningId;
    this.zoningName = zoningName;
    this.zoningLabel = zoningLabel;
    this.numberOfEntrances = numberOfEntrances;
    this.zoningStatus = zoningStatus;
    this.zones = zones;
  }
}

export class Zone {
  entryName: string;
  smallSlots: Slot[];
  mediumSlots: Slot[];
  largeSlots: Slot[];
  constructor(
    entryName: string,
    smallSlots: Slot[],
    mediumSlots: Slot[],
    largeSlots: Slot[]
  ) {
    this.entryName = entryName;
    this.smallSlots = smallSlots;
    this.mediumSlots = mediumSlots;
    this.largeSlots = largeSlots;
  }
}

export const putZones = async (data: object) => {
  const params = {
    TableName: TABLE_NAME.parkingZones,
    Item: { ...data },
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    console.log('Success - Item added or updated', data);
  } catch (error) {
    console.log('ERROR', error);
  }
};

export const deleteZoning = async (zoningName: string) => {
  const params = {
    TableName: TABLE_NAME.parkingZones,
    Key: {
      zoningName: zoningName,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Success - Item deleted');
  } catch (error) {
    console.log('Error', error);
  }
};

export const getSlotsInRange = async (size: string, range: number[]) => {
  const slotsInRange: Slot[] = [];

  const smallSlots: Slot[] = [];
  const mediumSlots: Slot[] = [];
  const largeSlots: Slot[] = [];

  const sizes = Object.keys(SLOT_TYPES);

  for (let i = 0; i < sizes.length; i++) {
    for (let i = 0; i < TOTALS[size[i]]; i++) {
      const parkingSlot = (await getParkingSlot(
        `${SLOT_TYPES.small}_${i}`
      )) as Slot[];

      switch (size[i]) {
        case 'small':
          smallSlots.push(parkingSlot[0]);
          break;

        case 'medium':
          mediumSlots.push(parkingSlot[0]);
          break;

        case 'large':
          largeSlots.push(parkingSlot[0]);
          break;

        default:
          break;
      }
    }
  }

  switch (size) {
    case 'small':

    case 'small_0':
      const sSlots0 = smallSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      sSlots0.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'medium':

    case 'medium_0':
      const mSlots0 = mediumSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      mSlots0.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'large':

    case 'large_0':
      const lSlots0 = largeSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      lSlots0.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    default:
      break;
  }
};
