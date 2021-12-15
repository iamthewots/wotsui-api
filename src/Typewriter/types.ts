export interface Options {
    timePerChar: number;
    deleteModifier: number;
    ignorePunctuation?: boolean;
}

export interface ElementData {
    options?: Options;
    textNodesData: TextNodeData[];
    charsCount: number;
    status: Status;
    lastNodeIndex: number;
    lastCharIndex: number;
}

export interface TextNodeData {
    node: Node;
    text: string;
    length: number;
}

export enum Status {
    "Clear",
    "InProgress",
    "Partial",
    "Initial",
}
