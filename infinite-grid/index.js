import * as PIXI from 'pixi.js';
import { loadImages, Vector } from './helpers';

import t1 from './img/1.jpg';
import t2 from './img/2.jpg';
import t3 from './img/3.jpeg';
import t4 from './img/4.jpg';
import t5 from './img/5.jpg';
import t6 from './img/6.jpeg';
import t7 from './img/7.jpeg';
import t8 from './img/8.jpg';
import t9 from './img/4.jpg';
import t10 from './img/5.jpg';
import t11 from './img/6.jpeg';
import t12 from './img/7.jpeg';
import t13 from './img/8.jpg';
import t14 from './img/3.jpeg';
import t15 from './img/4.jpg';

class Grid {
  constructor(selector) {
    this.setup(selector);
    this.getImages();
    this.events();
  }

  setup(selector) {
    this.app = new PIXI.Application({
      backgroundColor: 0xeeeeee,
      resizeTo: window,
    });

    document.getElementById(selector).appendChild(this.app.view);

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.target = new Vector(0, 0);
  }

  events() {
    window.addEventListener('mousedown', (e) => {
      console.log(e.clientX);

      this.target.x = e.clientX;
      this.target.y = e.clientY;
    });
  }

  getImages() {
    this.images = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14, t15];
    this.loadedImages = [];

    loadImages(this.images, (images) => {
      images.forEach((img, i) => {
        new Img(img, this.container, this.app, i);
      });
    });
  }

  update() {
    console.log(this.target);
  }
}

class Img {
  constructor(src, container, app, i) {
    this.src = src;
    this.container = container;
    this.app = app;
    this.i = i;
    this.size = 300;
    this.margin = 30;

    this.step = (this.size + this.margin) * this.i;

    this.pos = new Vector(1 * this.step, 1 * this.i);
    this.vel = new Vector(0, 0);
    this.acc = new Vector(0, 0);

    this.add();
    this.update();
  }

  add() {
    const texture = PIXI.Texture.from(this.src.img);
    this.sprite = PIXI.Sprite.from(texture);

    this.sprite.width = this.size;
    this.sprite.height = this.size;

    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;

    this.container.addChild(this.sprite);
  }

  update() {
    this.app.ticker.add(() => {
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      this.sprite.position.x = this.pos.x;
      this.sprite.position.y = this.pos.y;
    });
  }
}

const g = new Grid('container');
