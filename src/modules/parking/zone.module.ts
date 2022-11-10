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

  for (let i = 0; i < TOTALS.small; i++) {
    const parkingSlot = (await getParkingSlot(
      `${SLOT_TYPES.small}_${i}`
    )) as Slot[];

    smallSlots.push(parkingSlot[0]);
  }

  for (let i = 0; i < TOTALS.medium; i++) {
    const parkingSlot = (await getParkingSlot(
      `${SLOT_TYPES.medium}_${i}`
    )) as Slot[];

    mediumSlots.push(parkingSlot[0]);
  }

  for (let i = 0; i < TOTALS.large; i++) {
    const parkingSlot = (await getParkingSlot(
      `${SLOT_TYPES.large}_${i}`
    )) as Slot[];

    largeSlots.push(parkingSlot[0]);
  }

  switch (size) {
    case 'small':
      const sSlots = smallSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      sSlots.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'small_0':
      const sSlots0 = smallSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      sSlots0.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'medium':
      const mSlots = mediumSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      mSlots.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'medium_0':
      const mSlots0 = mediumSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      mSlots0.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

    case 'large':
      const lSlots = largeSlots.filter((slot) => {
        return slot.slotLabel[1] >= range[0] && slot.slotLabel[1] <= range[1];
      });

      lSlots.forEach((slot) => {
        slotsInRange.push(slot);
      });

      return slotsInRange;

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

export const getSlotsInZone = (numberOfEntrances: number) => {
  switch (numberOfEntrances) {
    case 3:
      const three_sizes = Object.keys(ZONING_RANGES.zoning_0.entry_0);
      const three_ranges = Object.values(ZONING_RANGES.zoning_0.entry_0);

      const zones = Object.keys(ZONING_RANGES.zoning_0).map((entry, j) => {
        let smallSlots: Slot[] = [];
        let mediumSlots: Slot[] = [];
        let largeSlots: Slot[] = [];

        three_sizes.forEach(async (size, i) => {
          let smallSlots = (await getSlotsInRange(
            size,
            three_ranges[i]
          )) as Slot[];

          let mediumSlots = (await getSlotsInRange(
            size,
            three_ranges[i]
          )) as Slot[];

          let largeSlots = (await getSlotsInRange(
            size,
            three_ranges[i]
          )) as Slot[];

          // switch (i) {
          //   case 0:
          //     small.forEach((slot) => {
          //       smallSlots.push(slot);
          //     });
          //     break;

          //   case 1:
          //     medium.forEach((slot) => {
          //       mediumSlots.push(slot);
          //     });
          //     break;

          //   case 2:
          //     large.forEach((slot) => {
          //       largeSlots.push(slot);
          //     });
          //     break;

          //   default:
          //     break;
          // }

          if (
            i === three_sizes.length - 1 &&
            j === Object.keys(ZONING_RANGES.zoning_0).length - 1
          ) {
            // console.log('smallSlots', smallSlots.slice(0, 16));
            const zone = new Zone(
              entry,
              smallSlots.slice(0, 16),
              mediumSlots.slice(0, 11),
              largeSlots.slice(0, 8)
            );

            console.log('ZONE: ', zone);
          }
        });

        // return {
        //   entryName: entry,
        //   smallSlots: smallSlots,
        //   mediumSlots: mediumSlots,
        //   largeSlots: largeSlots,
        // };

        const zone = new Zone(entry, smallSlots, mediumSlots, largeSlots);
        return zone;
      });

      return zones;

    case 4:
      break;
  }
};

// const small = getSlotsInRange('small', ZONING_RANGES.zoning_0.entry_0.small);
// console.log('TEST: ', small);

// const getZoneSlots_0 = (zoneRanges: ZoneRanges_0) => {
//   const small = getSlotsInRange('small', zoneRanges.small);
//   const medium = getSlotsInRange('medium', zoneRanges.medium);
//   const large = getSlotsInRange('large', zoneRanges.large);

//   const zoningDetails = {
//     sSlots: small,
//     mSlots: medium,
//     lSlots: large,
//   };

//   return zoningDetails;
// };

// const getZoneSlots_1 = (zoneRanges: ZoneRanges_1) => {
//   const small = getSlotsInRange('small', zoneRanges.small);
//   const medium = getSlotsInRange('medium', zoneRanges.medium);
//   const large = getSlotsInRange('large', zoneRanges.large);
//   const small_0 = getSlotsInRange('small', zoneRanges.small_0);
//   const medium_0 = getSlotsInRange('medium', zoneRanges.medium_0);
//   const large_0 = getSlotsInRange('large', zoneRanges.large_0);

//   const zoningDetails = {
//     sSlots: small,
//     mSlots: medium,
//     lSlots: large,
//     sSlots_0: small_0,
//     mSlots_0: medium_0,
//     lSlots_0: large_0,
//   };

//   return zoningDetails;
// };

// const getParkingZonesSlots = (numberOfEntrances: number) => {
//   switch (numberOfEntrances) {
//     case 3:
//       const threeZones = [];

//       const firstSlots_3z = getZoneSlots_0(ZONING_RANGES.zoning_0.entry_0);
//       const firstEntry_3z = {
//         entryId: 'entry_0',
//         ...firstSlots_3z,
//       };
//       threeZones.push(firstEntry_3z);

//       const secondSlots_3z = getZoneSlots_1(ZONING_RANGES.zoning_0.entry_1);
//       const secondEntry_3z = {
//         entryId: 'entry_1',
//         ...secondSlots_3z,
//       };
//       threeZones.push(secondEntry_3z);

//       const thirdSlots_3z = getZoneSlots_0(ZONING_RANGES.zoning_0.entry_4);
//       const thirdEntry_3z = {
//         entryId: 'entry_4',
//         ...thirdSlots_3z,
//       };
//       threeZones.push(thirdEntry_3z);

//       return threeZones;

//     case 4:
//       const zoning_1 = Object.values(ZONING_RANGES.zoning_1);
//       const zoning_1Entries = Object.keys(ZONING_RANGES.zoning_1);

//       const fourZones = zoning_1.map((zoneRange, i) => {
//         const zoningDetails = {
//           entryId: zoning_1Entries[i],
//           ...getZoneSlots_0(zoneRange),
//         };
//         return zoningDetails;
//       });

//       return fourZones;

//     case 5:
//       const fiveZones = [];

//       const firstSlots_5z = getZoneSlots_0(ZONING_RANGES.zoning_2.entry_0);
//       const firstEntry_5z = {
//         entryId: 'entry_0',
//         ...firstSlots_5z,
//       };
//       fiveZones.push(firstEntry_5z);

//       const secondSlots_5z = getZoneSlots_1(ZONING_RANGES.zoning_2.entry_1);
//       const secondEntry_5z = {
//         entryId: 'entry_1',
//         ...secondSlots_5z,
//       };
//       fiveZones.push(secondEntry_5z);

//       const thirdSlots_5z = getZoneSlots_0(ZONING_RANGES.zoning_2.entry_3);
//       const thirdEntry_5z = {
//         entryId: 'entry_3',
//         ...thirdSlots_5z,
//       };
//       fiveZones.push(thirdEntry_5z);

//       const fourthSlots_5z = getZoneSlots_0(ZONING_RANGES.zoning_2.entry_4);
//       const fourthEntry_5z = {
//         entryId: 'entry_4',
//         ...fourthSlots_5z,
//       };
//       fiveZones.push(fourthEntry_5z);

//       const fifthSlots_5z = getZoneSlots_0(ZONING_RANGES.zoning_2.entry_5);
//       const fifthEntry_5z = {
//         entryId: 'entry_4',
//         ...fifthSlots_5z,
//       };
//       fiveZones.push(fifthEntry_5z);

//       return fiveZones;

//     case 6:
//       const zoning_3 = Object.values(ZONING_RANGES.zoning_3);
//       const zoning_3Entries = Object.keys(ZONING_RANGES.zoning_3);

//       const sixZones = zoning_3.map((zoneRange, i) => {
//         const zoningDetails = {
//           entryId: zoning_3Entries[i],
//           ...getZoneSlots_0(zoneRange),
//         };
//         return zoningDetails;
//       });

//       return sixZones;

//     default:
//       break;
//   }
// };

// export const getParkingZones = () => {
//   const zoningDetails = parkingZoning.map((zoning) => {
//     const zoningDetails = {
//       zoningId: `${zoning[0]}_${zoning[1]}`,
//       zoning: zoning,
//       zoningStatus: ZONING_STATUS.inactive,
//     };
//     return zoningDetails;
//   });
//   return zoningDetails;
// };

// const zoning = getParkingZones();

// export const getParkingZone = (numberOfEntrances: number) => {
//   switch (numberOfEntrances) {
//     case 3:
//       const parkingZone_0 = {
//         ...zoning[0],
//         numberOfEntrances: numberOfEntrances,
//         zones: getParkingZonesSlots(numberOfEntrances),
//       };

//       console.log('ZONING_0: ', parkingZone_0);
//       return parkingZone_0;

//     case 4:
//       const parkingZone_1 = {
//         ...zoning[1],
//         numberOfEntrances: numberOfEntrances,
//         zones: getParkingZonesSlots(numberOfEntrances),
//       };

//       console.log('ZONING_1: ', parkingZone_1);
//       return parkingZone_1;

//     case 5:
//       const parkingZone_2 = {
//         ...zoning[2],
//         numberOfEntrances: numberOfEntrances,
//         zones: getParkingZonesSlots(numberOfEntrances),
//       };

//       console.log('ZONING_2: ', parkingZone_2);
//       return parkingZone_2;

//     case 6:
//       const parkingZone_3 = {
//         ...zoning[3],
//         numberOfEntrances: numberOfEntrances,
//         zones: getParkingZonesSlots(numberOfEntrances),
//       };

//       console.log('ZONING_3: ', parkingZone_3);
//       return parkingZone_3;
//   }
// };

// // const zoning_0 = getParkingZone(3);
