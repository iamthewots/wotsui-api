export interface Options {
  [prop: string]: any;
  target?: "self" | "children";
  queue?: boolean;
  invert?: boolean;
  invertAdd?: boolean;
  invertRemove?: boolean;
  reactive?: boolean;
  interval?: number | number[];
}

export enum Method {
  "Remove",
  "Add",
}

export type TimeoutsMap = Map<string, number[]>;
