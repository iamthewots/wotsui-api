interface TypewriterOptions {
  timePerChar: number;
  ignorePunctuation: boolean;
}

interface TypewriterElementData {
  node: Node;
  textContent: string;
}

type Options = TypewriterOptions | { [prop: string]: any };

export default class Typewriter {
  _default_options: TypewriterOptions;
  _elements_db: Map<
    Element,
    {
      data: TypewriterElementData[];
      length: number;
      options?: TypewriterOptions;
    }
  >;

  constructor(options: Options) {
    this._elements_db = new Map();
    this._default_options = this.parseOptions(options);
  }

  parseOptions(obj: Options) {
    const opt: TypewriterOptions = {
      timePerChar: 15,
      ignorePunctuation: false,
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

  initElement(el: Element, options?: Options, merge?: boolean) {
    if (!(el instanceof Element)) {
      throw new Error("Invalid argument");
    }
    const elData = this.parseElementData(el);
    let opt = this._default_options;
    if (options) {
      opt = this.parseOptions(options);
      if (merge) {
        opt = { ...this._default_options, ...opt };
      }
    }

    let length = 0;
    for (let data of elData) {
      if (data.textContent) {
        length += data.textContent.length;
      }
    }
    
    this._elements_db.set(el, {
      data: elData,
      length: 0,
      options: opt,
    });
  }

  parseElementData(el: Element | Node, clear?: boolean) {
    let data: TypewriterElementData[] = [];
    el.childNodes.forEach((node) => {
      if (!node.textContent) {
        return data;
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
        data = data.concat(this.parseElementData(node));
      }
    });
    return data;
  }

  clearElement(el: Element) {
    const data = this.parseElementData(el, true);
    return data;
  }

  async restoreElement(el: Element, emits?: number | number[]) {
    const storedData = this._elements_db.get(el);
    if (!storedData || !storedData.data) {
      return;
    }
    const data = storedData.data;
    const options = storedData.options || this._default_options;
    for (const d of data) {
      const { node, textContent } = d;
      if (!textContent) {
        continue;
      }
      for (const char of textContent) {
        node.textContent += char;
        const timeToWait = this.getCharTimeToWait(char, options);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, timeToWait);
        });
      }
    }
  }

  getCharTimeToWait(char: string, options: Options) {
    const tpc = options.timePerChar;
    if (options.ignorePunctuation) {
      return tpc;
    }
    if (char.match(/\W\D/gi)) {
      if (",+=-@{}[]()".indexOf(char)) {
        return tpc * 4;
      } else if (":;".indexOf(char)) {
        return tpc * 8;
      } else if (".?!".indexOf(char)) {
        return tpc * 16;
      } else {
        return tpc * 2;
      }
    }
    return tpc;
  }
}
