export interface Options {
  timePerChar: number;
  deleteSpeed?: number;
  ignorePunctuation?: boolean;
}

export interface ElementData {
  options?: Options;
  textData: ElementText[];
  textLength: number;
  status: Status;
  writeState: {
    isAllowed: boolean;
    lastNodeIndex: number;
    lastCharIndex: number;
  };
}

export interface ElementText {
  node: Node;
  textContent: string;
}

export enum Status {
  "Clear",
  "Writing",
  "Partial",
  "Initial",
}
