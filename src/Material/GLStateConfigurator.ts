import IPassRecipe from "./Schema/IPassRecipe";
import IState from "./Schema/IState";
import IDynamicStateResolver from "./Schema/IDynamicStateResolver";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
import DefaultDynamicStateResolver from "./DefaultDynamicStateResolvers";
export default class GLStateConfigurator {
  private static _glEnableTargets: number[]
  = [WebGLRenderingContext.CULL_FACE,
  WebGLRenderingContext.DEPTH_TEST,
  WebGLRenderingContext.STENCIL_TEST,
  WebGLRenderingContext.BLEND,
  WebGLRenderingContext.SCISSOR_TEST,
  WebGLRenderingContext.DITHER,
  WebGLRenderingContext.POLYGON_OFFSET_FILL,
  WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE,
  WebGLRenderingContext.SAMPLE_COVERAGE];

  private static _dynamicStateResolvers: { [key: string]: IDynamicStateResolver } = {...DefaultDynamicStateResolver};

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
  public static configureForPass(gl: WebGLRenderingContext, passRecipe: IPassRecipe): void {
    const states = passRecipe.states;
    const functions = states.functions;
    if (!states.disable) {
      GLStateConfigurator.complementDisableState(passRecipe.states);
    }
    for (let i = 0; i < states.enable.length; i++) {
      gl.enable(states.enable[i]);
    }
    for (let i = 0; i < states.disable.length; i++) {
      gl.disable(states.disable[i]);
    }
    if (functions.blendColor) {
      gl.blendColor(functions.blendColor[0], functions.blendColor[1], functions.blendColor[2], functions.blendColor[3]);
    }
    if (functions.blendEquationSeparate) {
      gl.blendEquationSeparate(functions.blendEquationSeparate[0], functions.blendEquationSeparate[1]);
    }
    if (functions.blendFuncSeparate) {
      gl.blendFuncSeparate(functions.blendFuncSeparate[0], functions.blendFuncSeparate[1], functions.blendFuncSeparate[2], functions.blendFuncSeparate[3]);
    }
    if (functions.colorMask) {
      gl.colorMask(functions.colorMask[0], functions.colorMask[1], functions.colorMask[2], functions.colorMask[3]);
    }
    if (functions.cullFace) {
      gl.cullFace(functions.cullFace[0]);
    }
    if (functions.depthFunc) {
      gl.depthFunc(functions.depthFunc[0]);
    }
    if (functions.depthMask) {
      gl.depthMask(functions.depthMask[0]);
    }
    if (functions.depthRange) {
      gl.depthRange(functions.depthRange[0], functions.depthRange[1]);
    }
    if (functions.frontFace) {
      gl.frontFace(functions.frontFace[0]);
    }
    if (functions.lineWidth) {
      gl.lineWidth(functions.lineWidth[0]);
    }
    if (functions.polygonOffset) {
      gl.polygonOffset(functions.polygonOffset[0], functions.polygonOffset[1]);
    }
    if (functions.scissor) {
      gl.scissor(functions.scissor[0], functions.scissor[1], functions.scissor[2], functions.scissor[3]);
    }
  }

  /**
   * Complement disabling state based on enabled states.
   */
  public static complementDisableState(state: IState): void {
    if (!state.disable) {
      state.disable = [];
    }
    for (let key of GLStateConfigurator._glEnableTargets) {
      if (state.enable.indexOf(key) === -1) {
        state.disable.push(key);
      }
    }
  }
}
