import { ElementData, Options, Status, TextNodeData } from "../types.js";
import Typewriter from "../Typewriter.js";

export function initElement(this: Typewriter, el: Element, options?: Options) {
    if (!el || !(el instanceof Element)) {
        throw new Error("Invalid element");
    }
    const textNodesData = getElementTextNodesData(el);
    const charsCount = getElementCharsCount(textNodesData);
    const status = Status.Initial;
    const lastNodeIndex = textNodesData.length - 1;
    const lastCharIndex = textNodesData[lastNodeIndex].length - 1;
    const data: ElementData = {
        options: options ? this.parseOptions(options) : undefined,
        textNodesData,
        charsCount,
        status,
        lastNodeIndex,
        lastCharIndex,
    };
    this.elementsData.set(el, data);
}

function getElementTextNodesData(src: Element | Node) {
    let textNodesData: TextNodeData[] = [];
    src.childNodes.forEach((node) => {
        if (!node.textContent) {
            return;
        }
        if (node.nodeType === 3) {
            textNodesData.push({
                node,
                text: node.textContent,
                length: node.textContent.length,
            });
        } else {
            textNodesData = textNodesData.concat(getElementTextNodesData(node));
        }
    });
    return textNodesData;
}

function getElementCharsCount(textNodesData: TextNodeData[]) {
    let charsCount = 0;
    textNodesData.forEach((textNode) => {
        charsCount += textNode.length;
    });
    return charsCount;
}
