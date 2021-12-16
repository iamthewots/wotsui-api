export declare interface TypewriterOptions {
    timePerChar: number;
    deleteModifier: number;
    ignorePunctuation?: boolean;
}

export declare interface ElementData {
    options?: TypewriterOptions;
    textNodesData: TextNodeData[];
    charsCount: number;
    status: Status;
    lastNodeIndex: number;
    lastCharIndex: number;
}

export declare interface TextNodeData {
    node: Node;
    text: string;
    length: number;
}

export declare enum Status {
    "Clear",
    "InProgress",
    "Partial",
    "Initial",
}
