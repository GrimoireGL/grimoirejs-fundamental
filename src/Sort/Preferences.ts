import IState from "../Material/IState";

function asGLConstantArgs(args: string[], length: number): number[] {
  if (args.length !== length) {
    throw new Error("Unmatching argument count on preference parse");
  }
  return args.map(arg => {
    const argNum = WebGLRenderingContext[arg];
    if (typeof argNum !== "number") {
      throw new Error(`Unknown WebGL constant ${arg} was specified`);
    }
    return argNum as number;
  });
}

function asNumberArgs(args: string[], length: number): number[] {
  if (args.length !== length) {
    throw new Error("Unmatching argument count on preference parse");
  }
  return args.map(arg => {
    const argNum = Number.parseFloat(arg);
    if (isNaN(argNum)) {
      throw new Error("Failed to parse number on preference parsing");
    }
    return argNum as number;
  });
}

function asBooleanArgs(args: string[], length: number): boolean[] {
  if (args.length !== length) {
    throw new Error("Unmatching argument count on preference parse");
  }
  return args.map(arg => {
    if (arg !== "true" && arg !== "false") {
      throw new Error(`${arg} is not boolean`);
    }
    return arg === "true";
  });
}

export default {
  Enable: function(state: IState, args: string[]) {
    const enableTarget = WebGLRenderingContext[args[0]];
    if (typeof enableTarget !== "number") {
      throw new Error(`Unknown WebGL constant "${args[0]}" was specified on @Enable`);
    }
    state.enable.push(enableTarget);
  },
  Disable: function(state: IState, args: string[]) {
    const disableTarget = WebGLRenderingContext[args[0]];
    if (typeof disableTarget !== "number") {
      throw new Error(`Unknown WebGL constant "${args[0]}" was specified on @Disable`);
    }
    const index = state.enable.indexOf(disableTarget);
    if (index !== index) {
      state.enable.splice(index, 1);
    }
  },
  BlendFunc: function(state: IState, args: string[]) {
    const config = asGLConstantArgs(args, 2);
    state.functions.blendFuncSeparate = [config[0], config[1], WebGLRenderingContext.ONE,WebGLRenderingContext.ZERO];
  },
  BlendFuncSeparate: function(state: IState, args: string[]) {
    state.functions.blendFuncSeparate = asGLConstantArgs(args, 4);
  },
  BlendEquation: function(state: IState, args: string[]) {
    const config = asGLConstantArgs(args, 1);
    state.functions.blendEquationSeparate = [config[0], config[0]];
  },
  BlendEquationSeparate: function(state: IState, args: string[]) {
    state.functions.blendEquationSeparate = asGLConstantArgs(args, 4);
  },
  BlendColor: function(state: IState, args: string[]) {
    state.functions.blendColor = asNumberArgs(args, 4);
  },
  ColorMask: function(state: IState, args: string[]) {
    state.functions.colorMask = asBooleanArgs(args, 4);
    state.enable.push(WebGLRenderingContext.COLOR_WRITEMASK);
  },
  CullFace: function(state: IState, args: string[]) {
    state.functions.cullFace = asGLConstantArgs(args, 1);
  },
  DepthFunc: function(state: IState, args: string[]) {
    state.functions.depthFunc = asGLConstantArgs(args, 1);
  },
  DepthRange: function(state: IState, args: string[]) {
    state.functions.depthRange = asNumberArgs(args, 2);
  },
  FrontFace: function(state: IState, args: string[]) {
    state.functions.frontFace = asGLConstantArgs(args, 1);
  },
  LineWidth: function(state: IState, args: string[]) {
    state.functions.lineWidth = asNumberArgs(args, 1);
  },
  PolygonOffset: function(state: IState, args: string[]) {
    state.functions.polygonOffset = asNumberArgs(args, 2);
    state.enable.push(WebGLRenderingContext.POLYGON_OFFSET_FILL);
  },
  Scissor: function(state: IState, args: string[]) {
    state.functions.scissor = asNumberArgs(args, 4);
    state.enable.push(WebGLRenderingContext.SCISSOR_TEST);
  },
  ExposeMacro: function() {
    return;
  },
  ReferMacro:function(){
    return;
  }
};
