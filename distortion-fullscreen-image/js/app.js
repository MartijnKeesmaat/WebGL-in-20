import * as THREE from 'three';

import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';
import * as dat from 'dat.gui';
import img from '/img/img.jpg';
import gsap from 'gsap';

var OrbitControls = require('three-orbit-controls')(THREE);

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container = document.getElementById(selector);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0001, 1000);
    this.camera.position.set(0, 0, 2);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.setupResize();
    this.tabEvents();

    this.addObjects();
    this.resize();
    this.render();
    this.mouseEvents();
  }

  settings() {
    const that = this;
    this.settings = {
      time: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'time', 0, 100, 0.01);
    this.gui.addImage(this.settings, 'texturePath').onChange((image) => {
      body.append(image);
    });
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.imageAspect = 853 / 1280;
    let a1, a2;

    if (this.heigh / this.widht > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a1 = this.height / this.width / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    // fill screen with plane
    const dist = this.camera.position.z;
    const height = 1;
    this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    // Set ratio of plane to viewport
    if (this.width / this.height > 1) {
      this.plane.scale.x = this.camera.aspect;
    } else {
      this.plane.scale.y = 1 / this.camera.aspect;
    }

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives: enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        progress: { type: 'f', value: 0 },
        direction: { type: 'f', value: 0 },
        texture1: { type: 't', value: new THREE.TextureLoader().load(img) },
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  tabEvents() {
    let that = this;
    document.addEventListener('visibilitychange', function (e) {
      if (document.hidden) {
        that.stop();
      } else {
        that.play();
      }
    });
  }

  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }

  mouseEvents() {
    document.addEventListener('mousedown', (e) => {
      this.material.uniforms.direction.value = 0;
      gsap.to(this.material.uniforms.progress, {
        value: 1,
        duration: 0.5,
      });
    });

    document.addEventListener('mouseup', (e) => {
      this.material.uniforms.direction.value = 1;
      gsap.to(this.material.uniforms.progress, {
        value: 0,
        duration: 0.5,
      });
    });
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch('container');
