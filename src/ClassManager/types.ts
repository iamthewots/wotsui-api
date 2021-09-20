export interface Options {
  target: Target;
  queue?: boolean;
  invert?: boolean;
  invertAdd?: boolean;
  invertRemove?: boolean;
  reactive?: boolean;
  interval?: number | number[];
  ignoreIntervalOnAdd?: boolean;
  ignoreIntervalOnRemove?: boolean;
}

export enum Target {
  "Self",
  "Children",
}

export enum Method {
  "Remove",
  "Add",
}
