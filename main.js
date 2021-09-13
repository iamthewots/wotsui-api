import { IntersectionHandler, Typewriter } from "./dist/index.js";

const typ = document.getElementById("typewriter");

const typewriter = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: true,
});
typewriter.initElement(typ);
setTimeout(() => {
  typewriter.writeElement(typ, [25, 100]);
}, 1000);

const int = document.getElementById("intersection");
const intHnd = new IntersectionHandler(0.5, {
  toggleOpacity: false,
  intersectionClass: "on-int",
  noIntersectionClass: "no-int",
});
intHnd.observe(int);
