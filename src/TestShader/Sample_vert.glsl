attribute vec3 position;
uniform mat4 _matPVW;
varying vec3 color;
void main(){
  gl_Position = _matPVW * vec4(position,1.);
  color = (position + vec3(1,1,1))/2.;
}
