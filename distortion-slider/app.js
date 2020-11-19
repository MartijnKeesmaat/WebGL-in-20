import * as PIXI from 'pixi.js';

import t1 from './img/1.jpg';
import t2 from './img/2.jpg';
import t3 from './img/3.jpeg';
import t4 from './img/4.jpg';
import t5 from './img/5.jpg';
import t6 from './img/6.jpeg';
import t7 from './img/7.jpeg';
import t8 from './img/8.jpg';
import disp from './img/displace.jpg';

import fit from 'math-fit';
import gsap from 'gsap';

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
  constructor() {
    this.app = new PIXI.Application({
      backgroundColor: 0x0d0d0d,
      resizeTo: window,
    });
    document.body.appendChild(this.app.view);

    this.margin = 50;
    this.scroll = 0;
    this.scrollTarget = 0;
    this.width = (window.innerWidth - 2 * this.margin) / 3; // 3 images on the viewport
    this.height = window.innerHeight * 0.8;

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.images = [t1, t2, t3, t4, t5, t6, t7, t8];
    this.WHOLEWIDHT = this.images.length * (this.width + this.margin);

    loadImages(this.images, (images) => {
      this.loadedImages = images;
      this.add();
      this.render();
      this.scrollEvent();
      this.addFilter();
    });
  }

  add() {
    let parent = {
      w: this.width,
      h: this.height,
    };

    this.thumbs = [];

    this.loadedImages.forEach((img, i) => {
      const texture = PIXI.Texture.from(img.img);
      const sprite = new PIXI.Sprite(texture);
      const container = new PIXI.Container();
      const spriteContainer = new PIXI.Container();

      const mask = new PIXI.Sprite(PIXI.Texture.WHITE);
      mask.width = this.width;
      mask.height = this.height;

      sprite.mask = mask;

      sprite.anchor.set(0.5);
      sprite.position.set(sprite.texture.orig.width / 2, sprite.texture.orig.height / 2);

      const image = {
        w: sprite.texture.orig.width,
        h: sprite.texture.orig.height,
      };

      const cover = fit(image, parent);

      spriteContainer.position.set(cover.left, cover.top);
      spriteContainer.scale.set(cover.scale, cover.scale);

      container.x = (this.margin + this.width) * i;
      container.y = this.height / 10;

      spriteContainer.addChild(sprite);

      container.interactive = true;
      container.on('mouseover', this.mouseOn);
      container.on('mouseout', this.mouseOut);

      container.addChild(spriteContainer);
      container.addChild(mask);
      this.container.addChild(container);
      this.thumbs.push(container);
    });
  }

  mouseOn(e) {
    const el = e.target.children[0].children[0];

    gsap.to(el.scale, {
      duration: 0.3,
      x: 1.1,
      y: 1.1,
    });
  }

  mouseOut(e) {
    const el = e.currentTarget.children[0].children[0];

    gsap.to(el.scale, {
      duration: 0.3,
      x: 1,
      y: 1,
    });
  }

  scrollEvent() {
    document.onwheel = zoom;

    var self = this;

    function zoom(e) {
      self.scrollTarget = e.wheelDelta / 3;
    }
  }

  addFilter() {
    this.displacementSprite = PIXI.Sprite.from(disp);

    let source = {
      w: 512,
      h: 512,
    };

    let target = {
      w: window.innerWidth,
      h: window.innerHeight,
    };

    let cover = fit(source, target);
    this.displacementSprite.position.set(cover.left, cover.top);
    this.displacementSprite.scale.set(cover.scale, cover.scale);

    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

    this.displacementFilter.scale.x = 0;
    this.displacementFilter.scale.y = 0;
    this.container.filters = [this.displacementFilter];

    this.app.stage.addChild(this.displacementSprite);
  }

  calcPos(scroll, pos) {
    const item = this.width + this.margin;
    let temp = ((scroll + pos + this.WHOLEWIDHT + item) % this.WHOLEWIDHT) - item;
    return temp;
  }

  render() {
    this.app.ticker.add(() => {
      this.app.renderer.render(this.container);

      this.direction = this.scroll > 0 ? -1 : 1;

      this.scroll -= (this.scroll - this.scrollTarget) * 0.1;
      this.scroll *= 0.9;

      this.thumbs.forEach((th) => {
        th.position.x = this.calcPos(this.scroll, th.position.x);
      });

      const strength = 4;
      this.displacementFilter.scale.x = strength * this.direction * Math.abs(this.scroll);
    });
  }
}

new Sketch();
