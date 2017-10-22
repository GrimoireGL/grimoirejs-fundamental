import IWebGLRenderingContextWithId from "./WebGLRenderingContextWithId";

/**
 * Registry of gl related stuff. These instance are singleton for each gl context.
 */
export default class GLRelatedRegistryBase {

  private static _glRelatedRegistry: { [id: string]: { [registryName: string]: any } } = {};

  /**
   * Get specified resource by glContext and constructor of registry
   * @param gl
   * @param ctor
   */
  protected static __get<T>(gl: WebGLRenderingContext, ctor: { registryName: string, new(gl: WebGLRenderingContext): T }): T {
    const glWithId = gl as IWebGLRenderingContextWithId;
    if (glWithId.__id__ === void 0) {
      throw new Error("Supplied gl context seems not initialized by Grimoire.js");
    }
    if (GLRelatedRegistryBase._glRelatedRegistry[glWithId.__id__] === void 0) {
      GLRelatedRegistryBase._glRelatedRegistry[glWithId.__id__] = {};
    }
    if (GLRelatedRegistryBase._glRelatedRegistry[glWithId.__id__][ctor.registryName] !== void 0) {
      return GLRelatedRegistryBase._glRelatedRegistry[glWithId.__id__][ctor.registryName];
    }
    const newInstance = new ctor(glWithId);
    GLRelatedRegistryBase._glRelatedRegistry[glWithId.__id__][ctor.registryName] = newInstance;
    return newInstance;
  }

  protected static __getAll<T>(ctor: { registryName: string, new(gl: WebGLRenderingContext): T }): T[] {
    const result = [] as T[];
    for (const key in GLRelatedRegistryBase._glRelatedRegistry) {
      const contextContainer = GLRelatedRegistryBase._glRelatedRegistry[key];
      if (contextContainer[ctor.registryName] !== void 0) {
        result.push(contextContainer[ctor.registryName]);
      }
    }
    return result;
  }
}
