import { ClassManager, IntersectionHandler, Typewriter } from "./dist/index.js";

const typEl = document.getElementById("typewriter");

const typewriter = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: true,
});
typewriter.initElement(typEl);
setTimeout(() => {
  typewriter.writeElement(typEl, [25, 100]);
}, 1000);

const intEl = document.getElementById("intersection");
const intHnd = new IntersectionHandler(0.5, {
  toggleOpacity: false,
  intersectionClass: "on-int",
  noIntersectionClass: "no-int",
});
intHnd.observe(intEl);

const cmEl = document.getElementById("classmanager");
const cM = new ClassManager(cmEl, {
  target: "children",
  queue: true,
  interval: 250,
});
cM.add("cm");
setTimeout(() => {
  cM.remove("cm");
}, 500);
