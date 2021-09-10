import { IntersectionHandler, Typewriter } from "./dist/index.js";

const el = document.getElementById("typewriter");

const typewriter = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: false,
});
typewriter.initElement(el);
setTimeout(() => {
  typewriter.restoreElement(el, [25, 100]);
}, 1000);
