import { ZONING_RANGES } from '../modules/constants.module';
//How i did the zoning

// const zoning = (await queryParkingZonesTable(
//   TABLE_NAME.parkingZones,
//   'zoning_3'
// )) as Zoning[];

// const newZoningData = {
//   zoningName: zoning[0].zoningName,
//   zoningLabel: zoning[0].zoningLabel,
//   numberOfEntrances: 6,
//   zoningStatus: zoning[0].zoningStatus,
//   zones: [
//     {
//       entryName: 'entry_0',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_0.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_0.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_0.large
//       ),
//     },
//     {
//       entryName: 'entry_1',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_1.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_1.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_1.large
//       ),
//     },
//     {
//       entryName: 'entry_2',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_2.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_2.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_2.large
//       ),
//     },
//     {
//       entryName: 'entry_3',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_3.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_3.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_3.large
//       ),
//     },
//     {
//       entryName: 'entry_4',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_4.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_4.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_4.large
//       ),
//     },
//     {
//       entryName: 'entry_5',
//       smallSlots: await getSlotsInRange(
//         'small',
//         ZONING_RANGES.zoning_3.entry_5.small
//       ),
//       mediumSlots: await getSlotsInRange(
//         'medium',
//         ZONING_RANGES.zoning_3.entry_5.medium
//       ),
//       largeSlots: await getSlotsInRange(
//         'large',
//         ZONING_RANGES.zoning_3.entry_5.large
//       ),
//     },
//   ],
// };

// // console.log('zoning: ', newZoningData.zones[5].smallSlots);

// putZones(newZoningData);
