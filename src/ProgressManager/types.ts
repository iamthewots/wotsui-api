export interface Options {
  evaluation: Evaluation;
  autoReset?: boolean;
}

export enum Evaluation {
  "Linear",
  "Precise",
  "Bidirectional",
}

export interface Statistics {
  index: number;
  length: number;
  errorMargin: number;
  progressPercent: number;
}
