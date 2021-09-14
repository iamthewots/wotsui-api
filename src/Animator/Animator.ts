import { AnimationProperties, Options } from "./types";
import parseOptions from "./scripts/parse-options.js";
import parseAnimation from "./scripts/parse-animation";

export default class Animator {
  _default_options: Options;
  _elements_db: Map<Element, Options>;
  _animations_db: Map<string, AnimationProperties[]>;

  constructor(options: Options) {
    this._default_options = parseOptions(options);
    this._elements_db = new Map();
    this._animations_db = new Map();
  }

  createAnimation(id: string, ...aniProps: AnimationProperties[]) {
    const ani = parseAnimation(aniProps);
    this._animations_db.set(id, ani);
  }
}

const ani = new Animator({
  target: "self",
});

ani.createAnimation("fade", {
  name: "fade",
  duration: 250,
  fillMode: "none",
});
