export interface Options {
  [prop: string]: any;
  timePerChar: number;
  ignorePunctuation: boolean;
}

export interface ElementData {
  options?: Options;
  length: number;
  textData: ElementTextData[];
}

export interface ElementTextData {
  node: Node;
  textContent: string;
}
