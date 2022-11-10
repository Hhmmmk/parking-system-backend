import { v4 as uuidv4 } from 'uuid';

import {
  ENTRANCE_STATUS,
  TABLE_NAME,
  TOTALS,
  ZONING_RANGES,
} from '../constants.module';
import { docClient } from '../../lib/database/document';
import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { queryEntrancesTable } from '../../lib/database/query';

export class Entrance {
  entryId: undefined | string;
  entryName: string;
  entryStatus: string;

  constructor(
    entryId: undefined | string,
    entryName: string,
    entryStatus: string
  ) {
    this.entryId = entryId === undefined ? uuidv4() : entryId;
    this.entryName = entryName;
    this.entryStatus = entryStatus;
  }
}

export const generateEntrances = () => {
  const slots: Entrance[] = [];

  for (let i = 0; i < TOTALS.entry; i++) {
    const name = `entry_${i}`;

    const slot = new Entrance(undefined, name, ENTRANCE_STATUS.close);

    slots.push(slot);
  }

  return slots;
};

//==> FUNCTIONS FOR API METHODS <==/

//--> PUT / POST <--//
export const putEntrances = async (data: object) => {
  const params = {
    TableName: TABLE_NAME.entrances,
    Item: { ...data },
  };
  try {
    const data = await docClient.send(new PutCommand(params));
    console.log('Success - Item added or updated', data);
  } catch (error) {
    console.log('ERROR', error);
  }
};

export const setOpenEntranceStatus = async (entry: string) => {
  const entrance = (await queryEntrancesTable(
    TABLE_NAME.entrances,
    entry
  )) as Entrance[];

  const newEntranceData = {
    entryName: entrance[0].entryName,
    entryId: entrance[0].entryId,
    entryStatus: 'open',
  };

  putEntrances({ ...newEntranceData });
};

export const setCloseEntranceStatus = async () => {
  Object.keys(ZONING_RANGES.zoning_3).map(async (entry) => {
    const entrance = (await queryEntrancesTable(
      TABLE_NAME.entrances,
      entry
    )) as Entrance[];

    const newEntranceData = {
      entryName: entrance[0].entryName,
      entryId: entrance[0].entryId,
      entryStatus: 'close',
    };

    putEntrances({ ...newEntranceData });
  });
};

//--> GET <--//
export const getEntrance = async (entry: string) => {
  const entrance = (await queryEntrancesTable(
    TABLE_NAME.entrances,
    entry
  )) as Entrance[];

  return entrance;
};

export const getOpenEntrances = async (entryNames: string[]) => {
  let entrances: Entrance[] = [];

  const openEntrances = entryNames.forEach(async (entry, i) => {
    getEntrance(entry)
      .then((entry) => {
        entrances.push(entry[0]);

        return entrances;
      })
      .then((entrances) => {
        const openEntrances = entrances.filter((entrance) => {
          return entrance.entryStatus === 'open';
        });

        if (i === entryNames.length - 1) {
          console.log('OPEN ENTRANCES: ', openEntrances);
        }

        return openEntrances;
      });
  });

  return openEntrances;
};

//--> DELETE <--//
export const deleteEntrance = async (
  entryName: string,
  entryId: undefined | string
) => {
  const params = {
    TableName: TABLE_NAME.entrances,
    Key: {
      entryName: entryName,
      entryId: entryId,
    },
  };

  try {
    await docClient.send(new DeleteCommand(params));
    console.log('Success - Item deleted');
  } catch (error) {
    console.log('Error', error);
  }
};

export const deleteAllEntrances = async (entryNames: string[]) => {
  let entrances: Entrance[] = [];

  const openEntrances = entryNames.forEach(async (entry, i) => {
    getEntrance(entry)
      .then((entry) => {
        entrances.push(entry[0]);

        return entrances;
      })
      .then((entrances) => {
        // console.log('ENTRANCES: ', entrances);

        entrances.forEach((entry) => {
          if (entry !== undefined) {
            deleteEntrance(entry.entryName, entry.entryId);
          }
        });
      });
  });

  return openEntrances;
};
