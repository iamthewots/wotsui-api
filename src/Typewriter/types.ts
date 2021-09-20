export interface Options {
  timePerChar: number;
  ignorePunctuation?: boolean;
}

export interface ElementData {
  options?: Options;
  textLength: number;
  textData: ElementText[];
}

export interface ElementText {
  node: Node;
  textContent: string;
}
