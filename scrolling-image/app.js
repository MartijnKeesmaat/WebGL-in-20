import Sketch from './js/module.js';

const sketch = new Sketch('container');

let speed = 0;
let position = 0;
let rounded = 0;
const block = document.getElementById('block');
const wrap = document.getElementById('wrap');
let elems = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', function (e) {
  speed += e.deltaY * 0.0003;
});

let objs = Array(5).fill({ dist: 0 });

const raf = () => {
  position += speed;
  speed *= 0.8;

  objs.forEach((el, i) => {
    el.dist = Math.min(Math.abs(position - i), 1);
    el.dist = 1 - el.dist ** 2;
    elems[i].style.transform = `scale(${1 + 0.4 * el.dist})`;
  });

  let rounded = Math.round(position);
  let diff = rounded - position;

  position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;

  wrap.style.transform = `translate(0, ${-position * 100}px)`;
  requestAnimationFrame(raf);
};

raf();
