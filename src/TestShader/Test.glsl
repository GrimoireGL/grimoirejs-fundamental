attribute vec3 position;

@vert{
  void main(){
    gl_Position = vec4(position,1.);
  }
}

@frag{
  uniform float value;
  void main(){
    gl_FragColor = vec4(1,value,0,1);
  }
}
