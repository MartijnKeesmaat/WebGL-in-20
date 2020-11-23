uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5); // doesn't work
  vec4 color = texture2D(texture1, vUv);

  // gl_FragColor = vec4(vUv, 1.0, 1.);
  gl_FragColor = color;
  // gl_FragColor = vec4(1.,0.,0.,1.);
}