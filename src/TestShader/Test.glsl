attribute vec3 position;
uniform mediump float _time;
@vert{
  uniform mat4 _matPVM;
  void main(){
    gl_Position = _matPVM * vec4(position,1.);
    gl_Position.x *= abs(sin(_time/1000.) + position.x);
    gl_Position.y *= abs(cos(_time/200.) + position.y * position.z);

  }
}

@frag{
  uniform float value;

  void main(){
    gl_FragColor = vec4(1,value * abs(sin(_time/1000.)),0,1);
  }
}
