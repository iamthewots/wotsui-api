import { ElementData, ElementText, Options, Status } from "./types.js";

export default class Typewriter {
  private _options: Options;
  private _elements_db: Map<Element, ElementData>;

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

  updateOptions(obj: { [prop: string]: any }, el?: Element) {
    const opt = this.parseOptions(obj);
    if (el) {
      const data = this._elements_db.get(el);
      if (data) {
        const options = { ...data.options, ...opt };
        this._elements_db.set(el, { ...data, options });
        return options;
      }
    }
    const newOpt = { ...this._options, ...opt };
    this._options = newOpt;
    return this._options;
  }

  initElement(el: Element, options?: Options, clear = true) {
    if (!(el instanceof Element)) {
      return;
    }
    const textData = this.getElementText(el, clear);
    const textLength = this.getElementLength(textData);
    this._elements_db.set(el, {
      options: options ? this.parseOptions(options) : undefined,
      textData,
      textLength,
      status: clear ? Status.Clear : Status.Initial,
      writeState: {
        isAllowed: true,
        lastCharIndex: 0,
        lastNodeIndex: 0,
      },
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

  private getElementLength(textData: ElementText[]) {
    let length = 0;
    textData.forEach((td) => {
      length += td.textContent.length;
    });
    return length;
  }

  async write(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const { textData, status, writeState } = data;
    writeState.isAllowed = true;
    if (status === Status.Initial || status === Status.Writing) {
      return;
    }
    const opt = this.getOptions(el);
    this.changeStatus(el, Status.Writing);

    for (let x = writeState.lastNodeIndex; x < textData.length; x++) {
      const { node, textContent } = textData[x];
      if (!textContent || textContent === "") {
        continue;
      }
      for (let y = writeState.lastCharIndex; y < textContent.length; y++) {
        if (!writeState.isAllowed) {
          this.handleStopWriting(el, x, y);
          return;
        }

        const char = textContent[y];
        node.textContent += char;
        const ttw = this.getTimeToWait(char, opt);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, ttw);
        });
      }
    }
    this.changeStatus(el, Status.Initial);
  }

  private initWriting(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const { status, writeState } = data;
    writeState.isAllowed = true;
    if (status === Status.Initial || status === Status.Writing) {
      return;
    }
    const opt = this.getOptions(el);
    this.changeStatus(el, Status.Writing);
    return { data, opt };
  }

  private handleStopWriting(
    el: Element,
    lastNodeIndex: number,
    lastCharIndex: number
  ) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    if (data.status === Status.Writing) {
      this.changeStatus(el, Status.Partial);
      data.writeState.lastNodeIndex = lastNodeIndex;
      data.writeState.lastCharIndex = lastCharIndex;
    }
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

  private getOptions(el: Element) {
    const data = this._elements_db.get(el);
    if (!data || !data.options) {
      return this._options;
    }
    return { ...this._options, ...data.options };
  }

  private changeStatus(el: Element, status: Status) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    data.status = status;
    const eName =
      status === Status.Clear
        ? "clearedtext"
        : status === Status.Writing
        ? "writingtext"
        : "initialtext";
    const e = new CustomEvent(eName);
    el.dispatchEvent(e);
  }

  getStatus(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return -1;
    }
    return data.status;
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
    this.changeStatus(el, Status.Clear);
    data.writeState.lastNodeIndex = 0;
    data.writeState.lastCharIndex = 0;
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
    this.changeStatus(el, Status.Initial);
    data.writeState.isAllowed = false;
  }

  stopWriting(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    data.writeState.isAllowed = false;
  }
}
