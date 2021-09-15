import { ElementTextData } from "../types";

export default function parseElement(
  elOrNode: Element | Node,
  clear?: boolean
) {
  let data: ElementTextData[] = [];
  elOrNode.childNodes.forEach((node) => {
    if (!node.textContent) {
      return;
    }
    if (node.nodeType === 3) {
      data.push({
        node,
        textContent: node.textContent,
      });
      if (clear) {
        node.textContent = "";
      }
    } else {
      data = data.concat(parseElement(node, clear));
    }
  });
  return data;
}