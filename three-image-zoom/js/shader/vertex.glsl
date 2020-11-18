uniform float time;
uniform float progress;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;

void main() {
  vec3 pos = position;

  float distance = length(uv - vec2(0.5));
  float maxdist = length(vec2(0.5));

  float normalizedDistance = distance / maxdist;

  float stickTo = normalizedDistance;

  pos.z += stickTo * progress;

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}