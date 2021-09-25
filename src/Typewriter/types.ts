export interface Options {
  timePerChar: number;
  deleteMultiplier?: number;
  ignorePunctuation?: boolean;
}

export interface ElementData {
  options?: Options;
  textNodes: ElementNode[];
  textLength: number;
  status: Status;
  changeStatus: {
    isAllowed: boolean;
    lastNodeIndex: number;
    lastCharIndex: number;
  };
}

export interface ElementNode {
  node: Node;
  textContent: string;
}

export enum Status {
  "Clear",
  "Active",
  "Partial",
  "Initial"
}