import MaterialFactory from "../Material/MaterialFactory";
import GLRelatedRegistryBase from "./GLRelatedRegistryBase";
interface ExtensionRequest {
  extensionName: string;
  isNecessary: boolean;
}

export default class GLExtRequestor extends GLRelatedRegistryBase {

  public static registryName = "GLExtensionRequestor";

  /**
   * Some of extensions needed to override resolving extensions by this.
   */
  public static _customExtensionResolvers: { [key: string]: (gl: WebGLRenderingContext) => any } = {};

  public static _requestObserver: ((name: string) => void)[] = [];

  /**
   * Extension list requested to use.
   * @type {string[]}
   */
  private static _requestedExtensions: ExtensionRequest[] = [];

  public static get(gl: WebGLRenderingContext): GLExtRequestor {
    return this.__get(gl, GLExtRequestor);
  }
  /**
   * Check specified extension was supported on this device.
   * Note: This method would throw an exception if there was no WebGL context initialized yet.
   * @param  {string}  extName [description]
   * @return {boolean}         [description]
   */
  public static supported(extName: string): boolean {
    const fg = GLExtRequestor._getFirst();
    if (!fg) {
      throw new Error("There was no WebGLRenderingContext initialized yet");
    } else {
      return fg.extensions[extName] !== undefined && fg.extensions[extName] !== null;
    }
  }
  /**
   * Request extension to use.
   * @param {string} str [description]
   */
  public static request(extName: string, isNecessary = false): void {
    const index = GLExtRequestor._requestIndexOf(extName);
    if (index > -1 && isNecessary) {
      GLExtRequestor._requestedExtensions[index] = { extensionName: extName, isNecessary };
    } else if (index === -1) {
      GLExtRequestor._requestedExtensions.push({ extensionName: extName, isNecessary });
    }
    GLExtRequestor._requestObserver.forEach((o) => o(extName));
  }

  private static _getFirst(): GLExtRequestor {
    return GLExtRequestor.__getAll(GLExtRequestor)[0];
  }

  private static _requestIndexOf(extName: string): number {
    for (let i = 0; i < GLExtRequestor._requestedExtensions.length; i++) {
      if (GLExtRequestor._requestedExtensions[i].extensionName === extName) {
        return i;
      }
    }
    return -1;
  }

  public extensions: { [key: string]: any } = {};

  private _readyExtensions: { [key: string]: boolean } = {};

  constructor(public gl: WebGLRenderingContext) {
    super();
    this._resolveRequested();
    GLExtRequestor._requestObserver.push(this._resolveExtensionSafely.bind(this));
  }

  /**
   * Resolve all extension requested already.
   */
  private _resolveRequested(): void {
    GLExtRequestor._requestedExtensions.forEach((e) => {
      this._resolveExtensionSafely(e.extensionName);
    });
  }

  private _resolveExtensionSafely(extName: string): void {
    const e = GLExtRequestor._requestedExtensions[GLExtRequestor._requestIndexOf(extName)];
    if (!this._resolveExtension(e.extensionName) && e.isNecessary) {
      throw new Error(`A WebGL extension '${e.extensionName}' was requested. But that is not supported on this device.`);
    }
  }

  private _resolveExtension(name: string): boolean {
    if (this._readyExtensions[name]) {
      return true;
    }
    let ext;
    if (typeof GLExtRequestor._customExtensionResolvers[name] === "undefined") {
      ext = this.extensions[name] = this.gl.getExtension(name);
    } else {
      ext = this.extensions[name] = GLExtRequestor._customExtensionResolvers[name](this.gl);
    }
    this._readyExtensions[name] = this.extensions[name] !== void 0;
    if (ext) {
      MaterialFactory.get(this.gl).macro.setValue(name.toUpperCase(), "");
    }
    return !!this._readyExtensions[name];
  }
}

GLExtRequestor._customExtensionResolvers["WEBGL_color_buffer_float"] = (gl: WebGLRenderingContext) => {
  let isSupported: boolean;
  if (gl.getExtension("WEBGL_color_buffer_float") === null) {
    const fbo = gl.createFramebuffer();
    const tex = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      isSupported = false;
    } else {
      isSupported = true;
    }
    gl.deleteTexture(tex);
    gl.deleteFramebuffer(fbo);
  } else {
    isSupported = true;
  }
  return isSupported;
};
