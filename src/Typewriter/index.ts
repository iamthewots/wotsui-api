import { ElementData, ElementText, Options, State } from "./types.js";

export default class Typewriter {
  private _options: Options;
  private _elements_db: Map<Element, ElementData>;
  private _elements_states: Map<Element, State>;

  constructor(options: Options) {
    this._options = this.parseOptions(options);
    this._elements_db = new Map();
    this._elements_states = new Map();
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
    const state = this._elements_states.get(el);
    if (state === State.Writing || state === State.Initial) {
      console.log("whoopsie", state);
      return;
    }
    const opt = this.getOptions(el);
    const { textLength, textData } = data;
    let i = 0;

    this.changeState(el, State.Writing);
    for (const td of textData) {
      const { node, textContent } = td;
      if (!textContent || textContent === "") {
        continue;
      }
      for (const char of textContent) {
        if (this._elements_states.get(el) !== State.Writing) {
          return;
        }
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
    this._elements_states.set(el, state);
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
    return this._elements_states.get(el) || -1;
  }
}
