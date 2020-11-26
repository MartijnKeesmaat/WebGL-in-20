import * as PIXI from 'pixi.js';
import fit from 'math-fit';

import t1 from './img/1.jpg';
import t2 from './img/2.jpg';
import t3 from './img/3.jpeg';
import t4 from './img/4.jpg';
import t5 from './img/5.jpg';
import t6 from './img/6.jpeg';
import t7 from './img/3.jpeg';
import t8 from './img/7.jpeg';
import t9 from './img/8.jpg';
import t10 from './img/7.jpeg';
import t11 from './img/2.jpg';
import t12 from './img/4.jpg';
import t13 from './img/6.jpeg';
import t14 from './img/1.jpg';
import t15 from './img/8.jpg';

var PVector = function (x, y) {
  this.x = x;
  this.y = y;
};

PVector.prototype.add = function (v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;
};

const map = (from, to, s) => to[0] + ((s - from[0]) * (to[1] - to[0])) / (from[1] - from[0]);

function loadImages(paths, whenLoaded) {
  const imgs = [];
  const img0 = [];
  paths.forEach(function (path) {
    const img = new Image();
    img.onload = function () {
      imgs.push(img);
      img0.push({ path, img });
      if (imgs.length === paths.length) whenLoaded(img0);
    };
    img.src = path;
  });
}

class Sketch {
  constructor(selector) {
    /* #region  PIXI setup */
    this.app = new PIXI.Application({
      backgroundColor: 0xeeeeee,
      resizeTo: window,
    });

    document.getElementById(selector).appendChild(this.app.view);

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    /* #endregion */

    /* #region  Images */
    this.margin = window.innerHeight / 25;
    this.imageWidth = window.innerHeight / 1.8 - this.margin;
    this.imageHeight = window.innerHeight / 1.8 - this.margin;
    this.itemSize = this.imageHeight + this.margin;
    this.images = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15];
    /* #endregion */

    this.thumbs = [];

    this.mouseDown = false;
    this.mouseUp = false;

    this.pos = new PVector(0, 0);
    this.vel = new PVector(0, 0);
    this.acc = new PVector(0, 0);

    this.friction = 0.8;

    this.initialMousePos = new PVector(0, 0);

    loadImages(this.images, (images) => {
      this.loadedImages = images;
      this.render();
      this.addImages();
      this.addEvent();
    });
  }

  addEvent() {
    // The item (or items) to press and hold on
    let item = window;

    let timerID;
    let counter = 0;

    // let pressHoldEvent = new CustomEvent('pressHold');

    // Increase or decreae value to adjust how long
    // one should keep pressing down before the pressHold
    // event fires
    // let pressHoldDuration = 50;

    // Listening for the mouse and touch events
    item.addEventListener('mousedown', pressingDown, false);
    item.addEventListener('mouseup', notPressingDown, false);
    item.addEventListener('mouseleave', notPressingDown, false);

    item.addEventListener('touchstart', pressingDown, false);
    item.addEventListener('touchend', notPressingDown, false);

    item.addEventListener('mousemove', mouseMove, false);

    const that = this;

    function pressingDown(e) {
      requestAnimationFrame(timer);
      that.mouseDown = true;

      that.initialMousePos.x = e.clientX;
      that.initialMousePos.y = e.clientY;
    }

    function notPressingDown(e) {
      cancelAnimationFrame(timerID);
      counter = 0;
      that.mouseDown = false;
    }

    function mouseMove(e) {
      if (that.mouseDown === true) {
        that.vel.x = (that.initialMousePos.x - e.clientX) * -1;
        that.vel.y = (that.initialMousePos.y - e.clientY) * -1;
      }
    }

    function timer() {
      timerID = requestAnimationFrame(timer);
      counter++;
    }
  }

  addImages() {
    const grid = {
      x: 0,
      y: 0,
    };

    this.images.forEach((el, i) => {
      const texture = PIXI.Texture.from(this.loadedImages[i].img);
      const sprite = PIXI.Sprite.from(texture);
      const rowcount = 5;

      const isEven = grid.y % 2 === 0;

      sprite.x = this.itemSize * grid.x - 0; // ???
      sprite.y = this.itemSize * grid.y - this.itemSize / 2;

      sprite.width = this.imageWidth;
      sprite.height = this.imageHeight;

      grid.x++;
      if (grid.x === rowcount) {
        grid.x = 0;
        grid.y++;
      }

      this.container.addChild(sprite);
      this.thumbs.push(sprite);
    });
  }

  render() {
    this.app.ticker.add(() => {
      if (this.mouseDown) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
      }

      this.thumbs.forEach((th) => {
        th.position.x += (this.pos.x * this.friction) / 300;
        th.position.y += (this.pos.y * this.friction) / 300;
      });
    });
  }
}

new Sketch('container');
