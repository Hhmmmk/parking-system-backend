export const TABLE_NAME = {
  customers: 'Customers',
  entrances: 'Entrances',
  parkingSlots: 'ParkingSlots',
  parkingZones: 'ParkingZones',
  transactions: 'ParkingTransactions',
};

export const SLOT_TYPES = {
  small: 'sSlot',
  medium: 'mSlot',
  large: 'lSlot',
};

export interface TOTAL_TYPE {
  [key: string]: number;
}

export const TOTALS: TOTAL_TYPE = {
  slots: 104,
  small: 48,
  medium: 32,
  large: 24,
  entry: 6,
  zoning: 4,
};

export const ENTRANCE_STATUS = {
  open: 'open',
  close: 'close',
};

export const ZONING_STATUS = {
  active: 'active',
  inactive: 'inactive',
};

export const SLOT_STATUS = {
  available: 'available',
  occupied: 'occupied',
};

export const CUSTOMER_STATUS = {
  parked: 'parked',
  tempUnparked: 'tempUnparked',
  unparked: 'unparked',
};

export const ZONING_RANGES = {
  zoning_0: {
    entry_0: {
      small: [0, 15],
      medium: [0, 10],
      large: [0, 7],
    },
    entry_1: {
      small: [16, 23],
      medium: [11, 15],
      large: [8, 11],
      small_0: [40, 47],
      medium_0: [26, 31],
      large_0: [20, 23],
    },
    entry_4: {
      small: [24, 39],
      medium: [16, 25],
      large: [12, 19],
    },
  },

  zoning_1: {
    entry_0: {
      small: [0, 11],
      medium: [0, 7],
      large: [0, 5],
    },
    entry_1: {
      small: [12, 23],
      medium: [8, 15],
      large: [6, 11],
    },
    entry_3: {
      small: [36, 47],
      medium: [24, 31],
      large: [18, 23],
    },
    entry_4: {
      small: [24, 35],
      medium: [16, 23],
      large: [12, 17],
    },
  },

  zoning_2: {
    entry_0: {
      small: [10, 19],
      medium: [7, 12],
      large: [5, 9],
    },
    entry_1: {
      small: [20, 23],
      medium: [13, 15],
      large: [10, 11],
      small_0: [43, 47],
      medium_0: [29, 31],
      large_0: [22, 23],
    },
    entry_3: {
      small: [34, 42],
      medium: [23, 28],
      large: [17, 21],
    },
    entry_4: {
      small: [24, 33],
      medium: [16, 22],
      large: [12, 16],
    },
    entry_5: {
      small: [0, 9],
      medium: [0, 6],
      large: [0, 4],
    },
  },

  zoning_3: {
    entry_0: {
      small: [8, 15],
      medium: [5, 10],
      large: [4, 7],
    },
    entry_1: {
      small: [16, 23],
      medium: [11, 15],
      large: [8, 11],
    },
    entry_2: {
      small: [40, 47],
      medium: [26, 31],
      large: [20, 23],
    },
    entry_3: {
      small: [32, 39],
      medium: [21, 25],
      large: [16, 19],
    },
    entry_4: {
      small: [24, 31],
      medium: [16, 20],
      large: [12, 15],
    },
    entry_5: {
      small: [0, 7],
      medium: [0, 4],
      large: [0, 3],
    },
  },
};
