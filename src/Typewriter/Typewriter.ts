interface TypewriterOptions {
  timePerChar: number;
  ignorePunctuation: boolean;
}

type Options = TypewriterOptions | { [prop: string]: any };

interface TypewriterTextData {
  node: Node;
  textContent: string;
}

export default class Typewriter {
  _default_options: TypewriterOptions;

  constructor(options: Options) {
    this._default_options = this.parseOption(options);
  }

  parseOption(obj: Options) {
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

  extractText(el: Element | Node, clear?: boolean) {
    let txt: TypewriterTextData[] = [];
    el.childNodes.forEach((node) => {
      if (!node.textContent) {
        return txt;
      }
      if (node.nodeType === 3) {
        txt.push({
          node,
          textContent: node.textContent,
        });
        if (clear) {
          node.textContent = "";
        }
      } else {
        txt = txt.concat(this.extractText(node));
      }
    });
    return txt;
  }

  clear(el: Element) {
    return this.extractText(el, true);
  }

  async rewrite(src: Element | TypewriterTextData[], options: Options) {
    const txt = this.parseTextSrc(src);
    if (!txt) {
      throw new Error("Invalid source");
    }
    const opt = this.parseOption(options);
  }

  parseTextSrc(src: Element | TypewriterTextData[]) {
    let txt: TypewriterTextData[] | undefined;
    if (src instanceof Element) {
      txt = this.extractText(src, true);
    }
    if (Array.isArray(src) && src.length > 0) {
      src.forEach((item) => {
        if (typeof item !== "object") {
          return;
        }
        if (!(item.node instanceof Element || item.node instanceof Node)) {
          return;
        }
        if (typeof item.textContent !== "string") {
          return;
        }
      });
    }
    return txt;
  }
}
