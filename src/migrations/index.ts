import * as migration_20261031_040012_baseline from './20261031_040012_baseline';

export const migrations = [
  {
    up: migration_20261031_040012_baseline.up,
    down: migration_20261031_040012_baseline.down,
    name: '20261031_040012_baseline'
  },
];
