uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;
uniform sampler2D text;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;

uniform vec3 mouse;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

  

  float dist = length(vPosition - mouse);

  float prox = 1. - map(dist, 0., 0.2, 0., 1.);
  prox = clamp(prox, 0., 1.);

  vec2 zoomedUV1 = mix(vUv, mouse.xy + vec2(0.5), prox * progress);
  vec4 textColor = texture2D(text, zoomedUV1);

  gl_FragColor = textColor;
} 