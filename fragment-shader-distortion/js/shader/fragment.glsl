uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displacement;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
  float t = time * 0.1;

  vec4 displace = texture2D(displacement, vUv.yx);

  vec2 displacedUV = vec2(
    vUv.x,
    vUv.y
  );

  displacedUV.y = mix(vUv.y, displace.r - 0.2, progress);

  vec4 color = texture2D(image, displacedUV);

  color.r = texture2D(image, displacedUV + vec2(0.,10.*0.005) * progress).r;
  color.g = texture2D(image, displacedUV + vec2(0.,10.*0.001) * progress).g;
  color.b = texture2D(image, displacedUV + vec2(0.,10.*0.002) * progress).b;


  gl_FragColor = color;
}