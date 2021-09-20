import { ClassManager, IntersectionManager, Typewriter } from "./dist/index.js";

const typEl = document.getElementById("typewriter");

const typewriter = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: true,
});
typewriter.initElement(typEl);
setTimeout(() => {
  typewriter.write(typEl);
}, 1000);

const intEl = document.getElementById("intersection");
const intMan = new IntersectionManager(0.5, {
  toggleOpacity: false,
  intersectionClass: "on-int",
  noIntersectionClass: "no-int",
});
intMan.observe(intEl);

const cmEl = document.getElementById("classmanager");
const cM = new ClassManager(cmEl, {
  target: 1,
  queue: true,
  interval: 250,
  invert: true,
});
cM.add("cm");
cmEl.addEventListener("classapplied", () => {
  cM.remove("cm");
})
