import { IncomingMessage, ServerResponse } from 'http';
import {
  generateEntrances,
  putEntrances,
  setCloseEntranceStatus,
  setOpenEntranceStatus,
  getOpenEntrances,
  deleteAllEntrances,
} from '../../modules/entrance/entrance.module';
import {
  getJSONDataFromRequestStream,
  getId,
} from '../../utils/generateParams.utils';

import {
  TABLE_NAME,
  ZONING_RANGES,
  ZONING_STATUS,
} from '../../modules/constants.module';
import { queryParkingZonesTable } from '../../lib/database/query';
import { putZones, Zoning } from '../../modules/parking/zone.module';

export const entranceRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const entryNames = Object.keys(ZONING_RANGES.zoning_3);

  const zoningNames = Object.keys(ZONING_RANGES);

  const setAllInactive = () => {
    zoningNames.forEach(async (zoning) => {
      const getZoning = (await queryParkingZonesTable(
        TABLE_NAME.parkingZones,
        zoning
      )) as Zoning[];

      const updatedZoning = {
        ...getZoning[0],
        zoningStatus: ZONING_STATUS.inactive,
      };

      putZones(updatedZoning);
    });
  };

  switch (req.method) {
    case 'POST':
      const entrancesData = generateEntrances();

      entrancesData.forEach((entrance) => {
        putEntrances(entrance);
      });

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully added all entry-ways';

    case 'PUT':
      const putResult = (await getJSONDataFromRequestStream(req)) as {
        numberOfEntrances: number;
      };

      if (putResult.numberOfEntrances < 3 || putResult.numberOfEntrances > 6) {
        res.writeHead(400, { 'Content-Type': 'none' });
        return 'Invalid Request';
      }

      setCloseEntranceStatus();

      switch (putResult.numberOfEntrances) {
        case 3:
          const threeEntries = Object.keys(ZONING_RANGES.zoning_0);

          threeEntries.map((entry) => {
            setOpenEntranceStatus(entry);
          });

          setAllInactive();

          const zoning_0 = (await queryParkingZonesTable(
            TABLE_NAME.parkingZones,
            'zoning_0'
          )) as Zoning[];

          const updatedZoning_0 = {
            ...zoning_0[0],
            zoningStatus: ZONING_STATUS.active,
          };

          putZones(updatedZoning_0);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          return 'Successfully updated number of entry-ways';

        case 4:
          const fourEntries = Object.keys(ZONING_RANGES.zoning_1);

          fourEntries.map((entry) => {
            setOpenEntranceStatus(entry);
          });

          setAllInactive();

          const zoning_1 = (await queryParkingZonesTable(
            TABLE_NAME.parkingZones,
            'zoning_1'
          )) as Zoning[];

          const updatedZoning_1 = {
            ...zoning_1[0],
            zoningStatus: ZONING_STATUS.active,
          };

          putZones(updatedZoning_1);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          return 'Successfully updated number of entry-ways';

        case 5:
          const fiveEntries = Object.keys(ZONING_RANGES.zoning_2);

          fiveEntries.map((entry) => {
            setOpenEntranceStatus(entry);
          });

          setAllInactive();

          const zoning_2 = (await queryParkingZonesTable(
            TABLE_NAME.parkingZones,
            'zoning_2'
          )) as Zoning[];

          const updatedZoning_2 = {
            ...zoning_2[0],
            zoningStatus: ZONING_STATUS.active,
          };

          putZones(updatedZoning_2);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          return 'Successfully updated number of entry-ways';

        case 6:
          const sixEntries = Object.keys(ZONING_RANGES.zoning_3);

          sixEntries.map((entry) => {
            setOpenEntranceStatus(entry);
          });

          setAllInactive();

          const zoning_3 = (await queryParkingZonesTable(
            TABLE_NAME.parkingZones,
            'zoning_3'
          )) as Zoning[];

          const updatedZoning_3 = {
            ...zoning_3[0],
            zoningStatus: ZONING_STATUS.active,
          };

          putZones(updatedZoning_3);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          return 'Successfully updated number of entry-ways';
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully updated number of entry-ways';

    case 'GET':
      getOpenEntrances(entryNames);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully retrieved all open entry-ways';

    case 'DELETE':
      deleteAllEntrances(entryNames);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully deleted all  entry-ways';

    default:
      break;
  }

  return `Entrance Request: ${req.method}`;
};
