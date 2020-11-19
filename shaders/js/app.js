import * as THREE from 'three';

import vertex from './shader/vertex.glsl';
import fragment from './shader/fragment.glsl';
import * as dat from 'dat.gui';

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
    this.direction = 1;

    this.container = document.getElementById(selector);
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.0001, 1000);
    this.camera.position.set(0, 0, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0.0;

    this.paused = false;

    this.setupResize();
    this.tabEvents();

    this.addObjects();
    this.resize();
    this.render();
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
        resolution: { type: 'v4', value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

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

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);

    this.plane.rotation.x -= 0.001;
    this.plane.rotation.y -= 0.001;
  }
}

new Sketch('container');
