interface Sensor {
  name: string;
  room?: string;
  reading?: string;
  unit?: string;
  /** out of range carries a 2px warning left border — the only place a semantic
   *  color touches a surface edge */
  outOfRange?: boolean;
  lastSeen?: string;
}

type StatTileProps = {
  label: string;
  reading: string;
  unit?: string;
  outOfRange?: boolean;
};

type SensorRowProps = {
  sensor: Sensor;
  last: boolean;
};

export type { Sensor, StatTileProps, SensorRowProps };
