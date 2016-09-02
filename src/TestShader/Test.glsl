attribute vec3 position;
uniform mediump float _time;
varying vec2 posXY;
@vert{
  uniform mat4 _matPVM;
  void main(){
    gl_Position = _matPVM * vec4(position,1.);
    gl_Position.x *= abs(sin(_time/1000.) + position.x);
    gl_Position.y *= abs(cos(_time/200.) + position.y * position.z);
    posXY = position.xy;
  }
}

@frag{
  @{type:"color",default:"red"}
  uniform vec4 color;

  uniform sampler2D testTex;

  void main(){
    gl_FragColor = texture2D(testTex,posXY);
  }
}
