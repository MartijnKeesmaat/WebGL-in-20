import * as PIXI from 'pixi.js';
import fit from 'math-fit';

import t1 from './img/1.jpg';
import t2 from './img/2.jpg';
import t3 from './img/3.jpeg';
import t4 from './img/4.jpg';
import t5 from './img/5.jpg';
import t6 from './img/6.jpeg';
import t7 from './img/7.jpeg';
import t8 from './img/8.jpg';

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
    this.images = [t1, t2, t3, t4, t5, t6, t7, t8];
    this.imageWidth = 400;
    this.imageHeight = 400;
    /* #endregion */

    loadImages(this.images, (images) => {
      this.loadedImages = images;
      this.render();
      this.addImages();
    });
  }

  addImages() {
    console.log('this.loadedImages', this.loadedImages);

    const bunny = PIXI.Sprite.from(this.loadedImages[0].img);

    bunny.anchor.set(0.5);
    bunny.x = this.app.screen.width / 2;
    bunny.y = this.app.screen.height / 2;

    bunny.width = this.imageWidth;
    bunny.height = this.imageHeight;

    this.app.stage.addChild(bunny);

    // this.loadedImages.forEach((img, i) => {

    // });
  }

  render() {
    this.app.ticker.add(() => {
      // console.log(this.loadedImages);
    });
  }
}

new Sketch('container');
