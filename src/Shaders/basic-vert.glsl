/**
 * Simplest way of transforming vertices on vertex shader
 */
 #ifdef ATTRIBUTE_COLOR_ENABLED
 varying vec4 vColor;
 #endif

 varying vec2 vTexCoord;
 varying vec3 vPosition;
 #ifdef ATTRIBUTE_NORMAL_ENABLED
 varying vec3 vNormal;
 #endif
#ifdef VS
  @POSITION
  attribute vec3 position;

  #ifdef ATTRIBUTE_TEXCOORD_ENABLED
  @TEXCOORD
  attribute vec2 texCoord;
  #endif

  #ifdef ATTRIBUTE_NORMAL_ENABLED
  @NORMAL
  attribute vec3 normal;
  #endif

  @MODELVIEWPROJECTION
  uniform mat4 _matPVM;

  @MODEL
  uniform mat4 _matM;

  #ifdef ATTRIBUTE_COLOR_ENABLED
  @COLOR
  attribute vec4 attrColor;
  #endif

  void main()
  {
    gl_Position = _matPVM * vec4(position,1.0);
    vPosition = (_matM * vec4(position,1.0)).xyz;
    #ifdef ATTRIBUTE_NORMAL_ENABLED
    vNormal = (_matM * vec4(normal,0.)).xyz;
    #endif
    #ifdef ATTRIBUTE_TEXCOORD_ENABLED
    vTexCoord = texCoord;
    #endif
    #ifndef ATTRIBUTE_TEXCOORD_ENABLED
    vTexCoord = position.xy/2.0 + vec2(0.5);
    #endif
    #ifdef ATTRIBUTE_COLOR_ENABLED
    vColor = attrColor;
    #endif
  }
#endif
