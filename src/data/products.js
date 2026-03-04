// Katalog produktů pro O2 Spolu

export const MOBILE_TARIFFS = [
  { id: 'neo-6gb', name: 'NEO+ 6 GB', price: 399, data: '6 GB', features: ['Neomezené volání a SMS'] },
  { id: 'neo-15gb', name: 'NEO+ 15 GB', price: 499, data: '15 GB', features: ['Neomezené volání a SMS'] },
  { id: 'neo-unlimited', name: 'NEO+ Neomezená data', price: 699, data: 'Neomezená', features: ['Neomezené volání a SMS', 'Data naplno'] },
]

export const SIM_TYPES = [
  { id: 'sim', name: 'SIM karta', price: 0 },
  { id: 'esim', name: 'eSIM', price: 0 },
]

export const TV_PACKAGES = [
  { id: 'oneplay-k-internetu', name: 'Oneplay k Internetu', price: 0, channels: 52 },
  { id: 'oneplay-extra-zabava', name: 'Oneplay Extra Zábava', price: 199, channels: 108 },
  { id: 'oneplay-extra-sport', name: 'Oneplay Extra Sport', price: 299, channels: 104 },
]

export const INTERNET_OPTIONS = [
  { id: '100mbit', name: 'Internet 100 Mb/s', price: 399 },
  { id: '500mbit', name: 'Internet 500 Mb/s', price: 499 },
  { id: '1gbit', name: 'Internet až 1 Gb/s', price: 599 },
]

/** Presety balíčků – rychlá volba pro uživatele (Flow 4) */
export const BUNDLE_PRESETS = [
  {
    id: 'mobil',
    name: 'Mobil',
    services: ['NEO+ 6 GB'],
    price: 399,
    savings: 0,
    order: { mobileLines: [{ tariffId: 'neo-6gb', simType: 'sim' }], internet: null, tv: null },
  },
  {
    id: 'internet-mobil',
    name: 'Internet + mobil',
    services: ['NEO+ 15 GB', 'Internet až 1 Gb/s'],
    price: 848,
    savings: 150,
    order: {
      mobileLines: [{ tariffId: 'neo-15gb', simType: 'sim' }],
      internet: { id: '1gbit' },
      tv: null,
    },
  },
  {
    id: 'rodinny',
    name: 'Rodinný balíček',
    services: ['2× NEO+ 15 GB', 'Internet až 1 Gb/s', 'Oneplay k Internetu'],
    price: 1148,
    savings: 249,
    order: {
      mobileLines: [
        { tariffId: 'neo-15gb', simType: 'sim' },
        { tariffId: 'neo-15gb', simType: 'sim' },
      ],
      internet: { id: '1gbit' },
      tv: { id: 'oneplay-k-internetu' },
    },
  },
  {
    id: 'internet-tv',
    name: 'Internet + TV',
    services: ['Internet až 1 Gb/s', 'Oneplay k Internetu'],
    price: 491,
    savings: 108,
    order: {
      mobileLines: [],
      internet: { id: '1gbit' },
      tv: { id: 'oneplay-k-internetu' },
    },
  },
]
