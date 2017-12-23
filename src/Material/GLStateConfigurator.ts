import DefaultDynamicStateResolver from "./Defaults/DefaultDynamicStateResolvers";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
import IDynamicStateResolver from "./Schema/IDynamicStateResolver";
import IPassRecipe from "./Schema/IPassRecipe";
import IState from "./Schema/IState";
import GLRelatedRegistryBase from "../Resource/GLRelatedRegistryBase";
export default class GLStateConfigurator extends GLRelatedRegistryBase {
  public static registryName = "GLStateConfigurator";

  public static get(gl: WebGLRenderingContext): GLStateConfigurator {
    return this.__get(gl, GLStateConfigurator);
  }

  private static _glEnableTargets: number[] = [
    WebGLRenderingContext.CULL_FACE,
    WebGLRenderingContext.DEPTH_TEST,
    WebGLRenderingContext.STENCIL_TEST,
    WebGLRenderingContext.BLEND,
    WebGLRenderingContext.DITHER,
    WebGLRenderingContext.POLYGON_OFFSET_FILL,
    WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE,
    WebGLRenderingContext.SAMPLE_COVERAGE];

  private static _dynamicStateResolvers: { [key: string]: IDynamicStateResolver } = { ...DefaultDynamicStateResolver };

  public static registerDynamicStateResolver(key: string, resolver: IDynamicStateResolver): void {
    GLStateConfigurator._dynamicStateResolvers[key] = resolver;
  }

  public static getDynamicStateResolver(pass: Pass): (gl: WebGLRenderingContext, mat: IMaterialArgument) => void {
    if (pass.passRecipe.states.dynamicState) {
      const dynamicStates = pass.passRecipe.states.dynamicState;
      const functions = [] as ((gl: WebGLRenderingContext, mat: IMaterialArgument) => void)[];
      for (let i = 0; i < dynamicStates.length; i++) {
        const ds = dynamicStates[i];
        const resolverGenerator = GLStateConfigurator._dynamicStateResolvers[ds.stateResolver];
        if (!resolverGenerator) {
          throw new Error(`Unknown dynamic state resolver '${ds.stateResolver}' was required`);
        }
        functions.push(resolverGenerator(ds.args, pass));
      }
      return (gl: WebGLRenderingContext, mat: IMaterialArgument) => functions.forEach(f => f(gl, mat));
    }
    return () => void 0;
  }

  /**
   * Configure gl state based on pass recipe
   */
  public configureForPass(passRecipe: IPassRecipe): void {
    const states = passRecipe.states;
    const functions = states.functions;
    if (!states.disable) {
      GLStateConfigurator.complementDisableState(passRecipe.states);
    }
    for (let i = 0; i < states.enable.length; i++) {
      this.applyGLFlagIfChanged(states.enable[i], true);
    }
    for (let i = 0; i < states.disable.length; i++) {
      this.applyGLFlagIfChanged(states.disable[i], false);
    }
    this.applyIfChanged("blendColor", functions.blendColor[0], functions.blendColor[1], functions.blendColor[2], functions.blendColor[3]);
    this.applyIfChanged("blendEquationSeparate", functions.blendEquationSeparate[0], functions.blendEquationSeparate[1]);
    this.applyIfChanged("blendFuncSeparate", functions.blendFuncSeparate[0], functions.blendFuncSeparate[1], functions.blendFuncSeparate[2], functions.blendFuncSeparate[3]);
    this.applyIfChanged("colorMask", functions.colorMask[0], functions.colorMask[1], functions.colorMask[2], functions.colorMask[3]);
    this.applyIfChanged("cullFace", functions.cullFace[0]);
    this.applyIfChanged("depthFunc", functions.depthFunc[0]);
    this.applyIfChanged("depthMask", functions.depthMask[0]);
    this.applyIfChanged("depthRange", functions.depthRange[0], functions.depthRange[1]);
    this.applyIfChanged("frontFace", functions.frontFace[0]);
    this.applyIfChanged("polygonOffset", functions.polygonOffset[0], functions.polygonOffset[1]);
  }

  /**
   * Complement disabling state based on enabled states.
   */
  public static complementDisableState(state: IState): void {
    if (!state.disable) {
      state.disable = [];
    }
    for (const key of GLStateConfigurator._glEnableTargets) {
      if (state.enable.indexOf(key) === -1) {
        state.disable.push(key);
      }
    }
  }

  private _argCache: { [key: string]: any[] } = {};

  private _flagCache: { [key: string]: boolean } = {};

  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  public applyIfChanged(func: "clearColor", r: number, g: number, b: number, a: number);
  public applyIfChanged(func: "clearDepth", d: number);
  public applyIfChanged(func: "blendColor", r: number, g: number, b: number, a: number);
  public applyIfChanged(func: "blendEquationSeparate", c1: number, a1: number);
  public applyIfChanged(func: "blendFuncSeparate", c1: number, c2: number, a1: number, a2: number);
  public applyIfChanged(func: "colorMask", r: boolean, g: boolean, b: boolean, a: boolean);
  public applyIfChanged(func: "cullFace", cullDir: number);
  public applyIfChanged(func: "depthFunc", funcParam: number);
  public applyIfChanged(func: "depthMask", mask: boolean);
  public applyIfChanged(func: "depthRange", min: number, max: number);
  public applyIfChanged(func: "frontFace", front: number);
  public applyIfChanged(func: "polygonOffset", offset: number, offset2: number);
  public applyIfChanged(func: "scissor", x: number, y: number, w: number, h: number);
  public applyIfChanged(func: string, ...args: any[]) {
    if (this._argCache[func] === undefined) {
      this._argCache[func] = [];
    }
    let changed = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== this._argCache[func][i]) {
        changed = true;
        break;
      }
    }
    if (changed) { // If there were no change between last change
      this.gl[func].apply(this.gl, args);
      this._argCache[func] = args;
    }
  }

  public applyGLFlagIfChanged(target: number, state: boolean): void {
    if (this._flagCache[target] !== state) {
      if (state) {
        this.gl.enable(target);
      } else {
        this.gl.disable(target);
      }
      this._flagCache[target] = state;
    }
  }
}
