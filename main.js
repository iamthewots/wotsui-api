import { ClassManager, IntersectionManager, Typewriter } from "./dist/index.js";

// Typewriter
const typEl = document.getElementById("typewriter");
const tpw = new Typewriter({
  timePerChar: 25,
  ignorePunctuation: true,
});
tpw.initElement(typEl);
const stopTpwBtn = document.getElementById("stop-tpw");
const resumeTpwBtn = document.getElementById("resume-tpw");
const clearTpwBtn = document.getElementById("clear-tpw");
const restoreTpwBtn = document.getElementById("restore-tpw");

stopTpwBtn.addEventListener("click", () => {
  tpw.stopWriting(typEl);
});
resumeTpwBtn.addEventListener("click", () => {
  tpw.write(typEl);
});
clearTpwBtn.addEventListener("click", () => {
  tpw.clear(typEl);
});
restoreTpwBtn.addEventListener("click", () => {
  tpw.restore(typEl);
});

// Intersection Manager
const intEl = document.getElementById("intersection");
const intMan = new IntersectionManager({
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
});
