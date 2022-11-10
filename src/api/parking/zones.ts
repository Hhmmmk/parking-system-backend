import { IncomingMessage, ServerResponse } from 'http';
import { queryParkingZonesTable } from '../../lib/database/query';
import {
  TABLE_NAME,
  ZONING_RANGES,
  ZONING_STATUS,
} from '../../modules/constants.module';
import { Slot } from '../../modules/parking/slot.module';
import {
  deleteZoning,
  getSlotsInRange,
  putZones,
  Zone,
  Zoning,
} from '../../modules/parking/zone.module';
import { Label } from '../../modules/types.module';
// import { getParkingZone } from '../../modules/parking/zone.module';
import {
  getJSONDataFromRequestStream,
  getQueryParams,
  getPathParams,
  getId,
} from '../../utils/generateParams.utils';

export const zonesRequest = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const entryId = getId(req);

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
    case 'PUT':
      setAllInactive();

      const putResult = (await getJSONDataFromRequestStream(req)) as {
        zoningName: string;
      };

      const zoning = (await queryParkingZonesTable(
        TABLE_NAME.parkingZones,
        putResult.zoningName
      )) as Zoning[];

      const updatedZoning = {
        ...zoning[0],
        zoningStatus: ZONING_STATUS.active,
      };

      putZones(updatedZoning);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      return 'Successfully updated Zoning Status';

    case 'GET':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return 'Successfully updated Zoning Status';

    default:
      break;
  }

  if (entryId) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return 'Successfully retrieved zone details';
  }

  console.log('Retrieve current zoning pattern');

  // getSlotsInRange('small', ZONING_RANGES.zoning_0.entry_0.small);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  return 'Successfully retrieved current zoning pattern';
};
