import { IncomingMessage, ServerResponse } from 'http';
import { SLOT_TYPES, TOTALS } from '../../modules/constants.module';
import {
  deleteSlot,
  getParkingSlot,
  largeSlots,
  mediumSlots,
  putParkingSlots,
  Slot,
  smallSlots,
} from '../../modules/parking/slot.module';
import {
  getJSONDataFromRequestStream,
  getId,
} from '../../utils/generateParams.utils';

export const slotsRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const slotId = getId(req);
  switch (req.method) {
    case 'POST':
      smallSlots.forEach((slot) => {
        putParkingSlots(slot);
      });

      mediumSlots.forEach((slot) => {
        putParkingSlots(slot);
      });

      largeSlots.forEach((slot) => {
        putParkingSlots(slot);
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully added all Parking Slots';

    case 'PUT':
      const putResult = (await getJSONDataFromRequestStream(req)) as {
        slotName: string;
        slotStatus: string;
      };

      const setSlotStatus = async (slotName: string, slotStatus: string) => {
        const parkingSlot = await getParkingSlot(slotName);

        const newSlotData = {
          ...parkingSlot[0],
          slotName: putResult.slotName,
          slotStatus: slotStatus,
        };

        putParkingSlots(newSlotData);
      };

      setSlotStatus(putResult.slotName, putResult.slotStatus);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully updated slot status';

    case 'GET':
      const getResult = (await getJSONDataFromRequestStream(req)) as {
        slotName: string;
        slotStatus: string;
      };

      if (getResult.slotName.length) {
        const parkingSlot = await getParkingSlot(getResult.slotName);

        console.log('Slot Details: ', parkingSlot);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return 'Successfully retrieved slot details';
      }

      switch (getResult.slotStatus) {
        case '':
          const allSlots: Slot[] = [];

          const size = Object.keys(SLOT_TYPES);

          for (let i = 0; i < size.length; i++) {
            for (let j = 0; j < TOTALS[size[i] as string]; j++) {
              const parkingSlot = (await getParkingSlot(
                `${SLOT_TYPES.small}_${j}`
              )) as Slot[];

              allSlots.push(parkingSlot[0]);
            }
          }

          console.log('ALL SLOTS: ', allSlots);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return 'Successfully retrieved all parking slots';

        case 'available':
          const availableSlots: Slot[] = [];

          for (let i = 0; i < TOTALS.small; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.small}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'available') {
              availableSlots.push(parkingSlot[0]);
            }
          }

          for (let i = 0; i < TOTALS.medium; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.medium}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'available') {
              availableSlots.push(parkingSlot[0]);
            }
          }

          for (let i = 0; i < TOTALS.large; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.large}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'available') {
              availableSlots.push(parkingSlot[0]);
            }
          }

          console.log('AVAILABLE SLOTS: ', availableSlots);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return 'Successfully retrieved all available parking slots';

        case 'occupied':
          const occupiedSlots: Slot[] = [];

          for (let i = 0; i < TOTALS.small; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.small}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'occupied') {
              occupiedSlots.push(parkingSlot[0]);
            }
          }

          for (let i = 0; i < TOTALS.medium; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.medium}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'occupied') {
              occupiedSlots.push(parkingSlot[0]);
            }
          }

          for (let i = 0; i < TOTALS.large; i++) {
            const parkingSlot = (await getParkingSlot(
              `${SLOT_TYPES.large}_${i}`
            )) as Slot[];

            if (parkingSlot[0].slotStatus === 'occupied') {
              occupiedSlots.push(parkingSlot[0]);
            }
          }

          console.log('OCCUPIED SLOTS: ', occupiedSlots);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return 'Successfully retrieved all occupied parking slots';
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully retrieved slots';

    case 'DELETE':
      const deleteSlots: Slot[] = [];

      for (let i = 0; i < TOTALS.small; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.small}_${i}`
        )) as Slot[];

        deleteSlots.push(parkingSlot[0]);
      }

      for (let i = 0; i < TOTALS.medium; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.medium}_${i}`
        )) as Slot[];

        deleteSlots.push(parkingSlot[0]);
      }

      for (let i = 0; i < TOTALS.large; i++) {
        const parkingSlot = (await getParkingSlot(
          `${SLOT_TYPES.large}_${i}`
        )) as Slot[];

        deleteSlots.push(parkingSlot[0]);
      }

      deleteSlots.forEach((slot) => {
        deleteSlot(slot.slotName);
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully deleted all slots';

    default:
      break;
  }

  return `Slots Request: ${req.method}`;
};
