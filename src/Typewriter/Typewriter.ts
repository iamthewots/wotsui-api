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
      timePerChar: 25,
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
    const elData = this.parseElementData(el, true);
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
      length,
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

  async restoreElement(el: Element, emitSteps?: number | number[]) {
    let steps: number[] = [];
    if (emitSteps) {
      steps = this.parseEmitSteps(emitSteps);
    }
    const storedData = this._elements_db.get(el);
    if (!storedData || !storedData.data) {
      return;
    }
    const { data, length } = storedData;
    const options = storedData.options || this._default_options;
    let charIndex = 0;
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
        charIndex++;
        this.emitPercentageEvent(el, charIndex, length, steps);
      }
    }
  }

  getCharTimeToWait(char: string, options: Options) {
    const tpc = options.timePerChar;
    if (options.ignorePunctuation) {
      return tpc;
    }
    if (char === " ") {
      return 0;
    }
    if (char.match(/\W/g)) {
      if (char.match(/[\,\+\=\-\@\{\}\[\]\(\)]/)) {
        console.log(char, "virgola");
        return tpc * 8;
      }
      if (char.match(/[:;]/)) {
        return tpc * 16;
      }
      if (char.match(/[\.\?\!]/)) {
        console.log(char, "punto");
        return tpc * 32;
      }
    }
    return tpc;
  }

  parseEmitSteps(emitSteps: number | number[]) {
    let steps: number[] = [];
    if (emitSteps) {
      if (Array.isArray(emitSteps)) {
        steps = emitSteps;
      }
      if (typeof emitSteps === "number") {
        steps.push(emitSteps);
      }
    }
    if (steps.length > 0) {
      steps = steps.sort().filter((n) => {
        typeof n === "number" && (n >= 0 || n <= 100);
      });
    }
    return steps;
  }

  emitPercentageEvent(
    el: Element,
    charIndex: number,
    length: number,
    emitSteps: number[]
  ) {
    if (emitSteps.length === 0) {
      return;
    }
    const step = emitSteps[0];
    const percent = Math.round((charIndex * 100) / length);
    const errorMargin = Math.round(100 / length);
    const delta = step - percent;
    if (delta < errorMargin) {
      const e = new CustomEvent(`${step}-percent`);
      el.dispatchEvent(e);
      emitSteps.shift();
    }
  }
}
