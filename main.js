import {
  ClassManager,
  IntersectionManager,
  Typewriter,
} from "./dist/index.js";


// Typewriter
const typEl = document.getElementById("typewriter");
const tpw = new Typewriter({
  timePerChar: 10,
  deleteModifier: 0.25,
  ignorePunctuation: false,
});
tpw.initElement(typEl);
const stopTpwBtn = document.getElementById("stop-tpw");
const writeTpwBtn = document.getElementById("write-tpw");
const deleteTpwBtn = document.getElementById("delete-tpw");
const clearTpwBtn = document.getElementById("clear-tpw");
const restoreTpwBtn = document.getElementById("restore-tpw");

stopTpwBtn.addEventListener("click", () => {
  tpw.stopText(typEl);
});
writeTpwBtn.addEventListener("click", () => {
  tpw.writeText(typEl);
});
deleteTpwBtn.addEventListener("click", () => {
  tpw.deleteText(typEl);
});
clearTpwBtn.addEventListener("click", () => {
  tpw.clearText(typEl);
});
restoreTpwBtn.addEventListener("click", () => {
  tpw.restoreText(typEl);
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
