export default class GLSLUtil {
  private static _primitives: string[] = ["float", "bool", "int", "vec2", "vec3", "vec4", "ivec2", "ivec3", "ivec4", "bvec2", "bvec3", "bvec4", "mat2", "mat3", "mat4", "sampler1D", "sampler2D", "sampler3D", "samplerCube", "sampler1DShadow", "sampler2DShadow"];

  public static isPrimitive(type: string): boolean {
    return GLSLUtil._primitives.indexOf(type) >= 0;
  }
}
