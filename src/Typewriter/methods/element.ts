import { ElementNode, Options, Status } from "../types.js";
import Typewriter from "../Typewriter";

export function initElement(
  this: Typewriter,
  el: Element,
  options?: Options,
  clear?: boolean
) {
  if (!(el instanceof Element)) {
    return;
  }

  const opt = options ? this.parseOptions(options) : undefined;
  const textNodes = getElementTextNodes(el, clear);
  const textLength = getElementTextLength(textNodes);
  this.elementsData.set(el, {
    options: opt,
    textNodes,
    textLength,
    status: clear ? Status.Clear : Status.Initial,
    changeStatus: {
      isAllowed: true,
      lastNodeIndex: 0,
      lastCharIndex: 0,
    },
  });
}

export function getElementTextNodes(elOrNode: Element | Node, clear?: boolean) {
  let textNodes: ElementNode[] = [];
  elOrNode.childNodes.forEach((node) => {
    if (!node.textContent) {
      return;
    }
    if (node.nodeType === 3) {
      textNodes.push({
        node,
        textContent: node.textContent,
      });
      if (clear) {
        node.textContent = "";
      }
    } else {
      textNodes = textNodes.concat(getElementTextNodes(node, clear));
    }
  });
  return textNodes;
}

export function getElementTextLength(textNodes: ElementNode[]) {
  let length = 0;
  textNodes.forEach((node) => {
    length += node.textContent.length;
  });
  return length;
}
