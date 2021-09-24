export interface Options {
  direction?: Direction;
  autoReset?: boolean;
}

export enum Direction {
  "Linear",
  "Precise",
  "Bidirectional",
}

export interface ProgressStatistics {
  index: number;
  length: number;
  delta: number;
  percent: number;
}
