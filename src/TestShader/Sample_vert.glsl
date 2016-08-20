attribute vec3 position;
uniform mat4 _matPVW;
void main(){
  gl_Position = _matPVW * vec4(position,1.);
}
