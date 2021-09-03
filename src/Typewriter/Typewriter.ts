export interface TypewriterOptions {
  timePerChar: number;
  ignorePunctuation?: boolean;
  punctuationMultiplier: number;
  observeOnce?: boolean;
}

interface TypewriterTextData {
  node: Node;
  textContent: string;
}

type Options = { [prop: string]: any } | TypewriterOptions;

export default class Typewriter {
  _observer: IntersectionObserver;
  _default_options: TypewriterOptions;
  _options_list: Map<Element, TypewriterOptions>;
  _text_content: Map<Element, TypewriterTextData[]>;

  constructor(threshold = 1, options: Options) {
    this._observer = new IntersectionObserver(
      this.observerCallback.bind(this),
      {
        threshold,
      }
    );
    this._default_options = this.parseOptions(options);
    this._options_list = new Map();
    this._text_content = new Map();
  }

  observerCallback(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {}

  parseOptions(obj: { [prop: string]: any }) {
    const opt: TypewriterOptions = {
      timePerChar: 15,
      punctuationMultiplier: 1,
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

  registerElement(
    el: Element,
    options?: Options,
    observe?: boolean,
    clear?: boolean
  ) {
    const txt = this.extractText(el);
    this._text_content.set(el, txt);
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

  clearText(el: Element) {
    this.extractText(el, true);
  }

  restoreText(el: Element) {
    const txt = this._text_content.get(el);
    if (!txt) {
      return;
    }

    txt.forEach((data) => {
      const { node, textContent } = data;
      node.textContent = textContent;
    });
  }

  async writeText(el: Element) {
    const options = this._options_list.get(el) || this._default_options;
    const txt = this._text_content.get(el);
    if (!txt) {
      return;
    }
    for (const data of txt) {
      const { node, textContent } = data;
      if (!textContent) {
        continue;
      }
      for (const char of textContent) {
        node.textContent += char;
        const ttw = this.getCharTiming(char, options);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, ttw);
        });
      }
    }
  }

  getCharTiming(char: string, options: TypewriterOptions) {
    if (options.ignorePunctuation) {
      return options.timePerChar;
    }
    if (char.match(/\W\D/gi)) {
      const ttw = options.timePerChar * options.punctuationMultiplier;
      if (",+=-@{}[]()".indexOf(char)) {
        return ttw * 4;
      }
      if (":;".indexOf(char)) {
        return ttw * 8;
      }
      if (".?!".indexOf(char)) {
        return ttw * 16;
      }
      return ttw * 2;
    }
    return options.timePerChar;
  }
}
