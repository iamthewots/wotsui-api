export interface Options {
  [prop: string]: any;
  target?: "self" | "children";
  queue?: boolean;
  invert?: boolean;
  invertAdd?: boolean;
  invertRemove?: boolean;
  interval?: number | number[];
}

export type TimeoutsMap = Map<string, number[]>;
