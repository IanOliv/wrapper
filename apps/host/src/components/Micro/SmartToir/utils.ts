import type { Sensor, StatTileProps } from './types';

// Plausible placeholder readings — the panel keeps its layout when the local
// gateway isn't running.
const placeholderSensors: Sensor[] = [
  { name: 'Boiler return', room: 'Plant room', reading: '71.4', unit: '°C', lastSeen: '12s ago' },
  {
    name: 'Flow temperature',
    room: 'Plant room',
    reading: '58.2',
    unit: '°C',
    lastSeen: '12s ago',
  },
  {
    name: 'Header pressure',
    room: 'Plant room',
    reading: '3.41',
    unit: 'bar',
    outOfRange: true,
    lastSeen: '9s ago',
  },
  { name: 'Ambient', room: 'Workshop', reading: '19.8', unit: '°C', lastSeen: '31s ago' },
  { name: 'Humidity', room: 'Workshop', reading: '54.0', unit: '%', lastSeen: '31s ago' },
  { name: 'Door contact', room: 'Loading bay', reading: 'closed', lastSeen: '2m ago' },
  { name: 'Tank level', room: 'Yard', reading: '82.6', unit: '%', lastSeen: '48s ago' },
];

/** The 4-across tile row: three headline readings plus what is out of range. */
function summarise(sensors: Sensor[]): StatTileProps[] {
  const withReading = sensors.filter((sensor) => sensor.reading);
  const outOfRange = sensors.filter((sensor) => sensor.outOfRange);

  const headline = withReading.slice(0, 3).map((sensor) => ({
    label: sensor.name,
    reading: sensor.reading as string,
    unit: sensor.unit,
    outOfRange: sensor.outOfRange,
  }));

  return [
    ...headline,
    {
      label: 'Out of range',
      reading: String(outOfRange.length),
      unit: outOfRange.length === 1 ? 'sensor' : 'sensors',
      outOfRange: outOfRange.length > 0,
    },
  ];
}

export { placeholderSensors, summarise };
