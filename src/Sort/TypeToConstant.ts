if (!WebGLRenderingContext.ONE) {
  throw new Error("WebGLRenderingContext constant can not be retrived!");
}
const gl = WebGLRenderingContext;
const result = {
  vec2: gl.FLOAT_VEC2,
  vec3: gl.FLOAT_VEC3,
  vec4: gl.FLOAT_VEC4,
  ivec2: gl.INT_VEC2,
  ivec3: gl.INT_VEC3,
  ivec4: gl.INT_VEC4,
  bvec2: gl.BOOL_VEC2,
  bvec3: gl.BOOL_VEC3,
  bvec4: gl.BOOL_VEC4,
  float: gl.FLOAT,
  int: gl.INT,
  bool: gl.BOOL,
  sampler2D: gl.SAMPLER_2D,
  samplerCube: gl.SAMPLER_CUBE,
  mat4: gl.FLOAT_MAT4,
  mat3: gl.FLOAT_MAT3,
  mat2: gl.FLOAT_MAT2
};

export default result;