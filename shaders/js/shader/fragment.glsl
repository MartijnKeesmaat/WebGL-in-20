uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
  float t = time * 0.1;
  gl_FragColor = vec4(abs(sin(t) * vUv.y), vUv.x, 1.0, 1.);
}