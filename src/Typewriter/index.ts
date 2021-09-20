import { ElementData, ElementText, Options } from "./types";

export default class Typewriter {
  _options: Options;
  _elements_db: Map<Element, ElementData>;

  constructor(options: Options) {
    this._options = this.parseOptions(options);
    this._elements_db = new Map();
  }

  parseOptions(obj: { [prop: string]: any }) {
    return Typewriter.parseOptions(obj);
  }

  static parseOptions(obj: { [prop: string]: any }) {
    const opt: Options = {
      timePerChar: 25,
    };
    if (typeof obj !== "object") {
      return opt;
    }

    opt.ignorePunctuation = !!obj.ignorePunctuation;
    if (typeof obj.timePerChar === "number") {
      opt.timePerChar = obj.timePerChar;
    }
    return opt;
  }

  initElement(el: Element, options?: Options, clear = true) {
    if (!(el instanceof Element)) {
      return;
    }
    const textData = this.getElementText(el, clear);
    let textLength = 0;
    textData.forEach((td) => {
      textLength += td.textContent.length;
    });
    this._elements_db.set(el, {
      options: options ? this.parseOptions(options) : undefined,
      textLength,
      textData,
    });
  }

  private getElementText(elOrNode: Element | Node, clear?: boolean) {
    let data: ElementText[] = [];
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
        data = data.concat(this.getElementText(node, clear));
      }
    });
    return data;
  }

  async write(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const opt = this.getOptions(el);
    const { textLength, textData } = data;
    let i = 0;
    for (const td of textData) {
      const { node, textContent } = td;
      if (!textContent || textContent === "") {
        continue;
      }
      for (const char of textContent) {
        node.textContent += char;
        const ttw = this.getTimeToWait(char, opt);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, ttw);
        });
        i++;
      }
    }
  }

  private getOptions(el: Element) {
    const data = this._elements_db.get(el);
    if (!data || !data.options) {
      return this._options;
    }
    return { ...this._options, ...data.options };
  }

  private getTimeToWait(char: string, opt: Options) {
    const tpc = opt.timePerChar;
    if (opt.ignorePunctuation) {
      return tpc;
    }
    if (char.match(/\W/g)) {
      if (char.match(/[\@\{\}\[\]\(\)]/)) {
        return tpc * 4;
      }
      if (char.match(/[\,\>\<\%\$\€]/)) {
        return tpc * 8;
      }
      if (char.match(/[:;]/)) {
        return tpc * 16;
      }
      if (char.match(/[\.\?\!]/)) {
        return tpc * 24;
      }
    }
    return tpc;
  }

  clear(el: Element, updateBeforeClear?: boolean) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const textData = this.getElementText(el, true);
    if (updateBeforeClear) {
      data.textData = textData;
      this._elements_db.set(el, data);
    }
  }

  restore(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    data.textData.forEach((td) => {
      const { node, textContent } = td;
      node.textContent = textContent;
    });
  }
}
