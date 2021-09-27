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
  const elData: ElementData = {
    options: options ? this.parseOptions(options) : undefined,
    textNodesData,
    charsCount,
    status,
    lastNodeIndex,
    lastCharIndex,
  };
  this.elementsData.set(el, elData);
}

function getElementTextNodesData(src: Element | Node) {
  let tnd: TextNodeData[] = [];
  src.childNodes.forEach((node) => {
    if (!node.textContent) {
      return;
    }
    if (node.nodeType === 3) {
      tnd.push({
        node,
        text: node.textContent,
        length: node.textContent.length,
      });
    } else {
      tnd = tnd.concat(getElementTextNodesData(node));
    }
  });
  return tnd;
}

function getElementCharsCount(textNodesData: TextNodeData[]) {
  let length = 0;
  textNodesData.forEach((textNode) => {
    length += textNode.length;
  });
  return length;
}
