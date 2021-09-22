export interface Options {
  timePerChar: number;
  ignorePunctuation?: boolean;
}

export interface ElementData {
  options?: Options;
  textLength: number;
  textData: ElementText[];
  textState: {
    state: State;
    allowWriting: boolean;
    lastNodeIndex: number;
    lastCharIndex: number;
  };
}

export enum State {
  "Clear",
  "Writing",
  "Partial",
  "Initial",
}

export interface ElementText {
  node: Node;
  textContent: string;
}
