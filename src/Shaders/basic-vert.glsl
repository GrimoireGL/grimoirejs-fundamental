/**
 * Simplest way of transforming vertices on vertex shader
 */
#ifdef VS
  @POSITION
  attribute vec3 position;

  #ifdef ATTRIBUTE_TEXCOORD_ENABLED
  @TEXCOORD
  attribute vec2 texCoord;
  #endif
  @MODELVIEWPROJECTION
  uniform mat4 _matPVM;

  #ifdef ATTRIBUTE_COLOR_ENABLED
  @COLOR
  attribute vec4 attrColor;
  #endif

  void main()
  {
    gl_Position = _matPVM * vec4(position,1.0);
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
