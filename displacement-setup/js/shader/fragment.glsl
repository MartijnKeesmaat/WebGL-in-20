uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D displace;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

void main() {
  float t = time * 0.1;

  vec4 displace = texture2D(displace, vUv);
  vec2 displacedUV = vec2(
    vUv.x + progress * 0.1 * sin(vUv.y * 19. + time/4.), 
    vUv.y);

  vec4 color = texture2D(image, displacedUV);


  gl_FragColor = color;
}