import { ElementData, ElementText, Options, State } from "./types.js";

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
      textState: {
        state: clear ? State.Clear : State.Initial,
        allowWriting: true,
      },
    });
    this.changeState(el, clear ? State.Clear : State.Initial);
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
    const { textData, textLength, textState } = data;
    textState.allowWriting = true;
    if (textState.state === State.Initial) {
      return;
    }
    if (textState.state === State.Partial) {
      this.clear(el);
    }
    const opt = this.getOptions(el);
    let i = 0;
    this.changeState(el, State.Writing);

    let n = textState.lastNodeIndex;
    let c = textState.lastCharIndex;

    for (; n < textData.length; n++) {
      textState.lastNodeIndex = n;
      if (!textState.allowWriting) {
        this.handleStopWriting(el, n, c);
        return;
      }
      const { node, textContent } = textData[n];
      if (!textContent || textContent === "") {
        continue;
      }

      for (; c < textContent.length; c++) {
        textState.lastCharIndex = c;
        if (!textState.allowWriting) {
          this.handleStopWriting(el, n, c);
          return;
        }
        const char = textContent[c];
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
    this.changeState(el, State.Initial);
  }

  private handleStopWriting(el: Element, n: number, c: number) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    const { textState } = data;
    textState.lastNodeIndex = n;
    textState.lastCharIndex = c;
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
    this.changeState(el, State.Clear);
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
    this.changeState(el, State.Initial);
  }

  private changeState(el: Element, state: State) {
    const data = this._elements_db.get(el);
    if (!data) {
      return;
    }
    data.textState.state = state;
    const eName =
      state === State.Clear
        ? "clearedtext"
        : state === State.Writing
        ? "writingtext"
        : "restoredtext";
    const e = new CustomEvent(eName);
    el.dispatchEvent(e);
  }

  getState(el: Element) {
    const data = this._elements_db.get(el);
    if (!data) {
      return -1;
    }
    return data.textState.state;
  }
}
