import IState from "../Material/Schema/IState";

function asGLConstantArgs(args: string[], length: number): number[] {
  if (args.length !== length) {
    throw new Error("Unmatching argument count on preference parse");
  }
  return args.map(arg => {
    const argNum = (WebGLRenderingContext as any)[arg];
    if (typeof argNum !== "number") {
      throw new Error(`Unknown WebGL constant ${arg} was specified`);
    }
    return argNum;
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
    return argNum;
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
  Enable(state: IState, args: string[]) {
    const enableTarget = (WebGLRenderingContext as any)[args[0]];
    if (typeof enableTarget !== "number") {
      throw new Error(`Unknown WebGL constant "${args[0]}" was specified on @Enable`);
    }
    state.enable.push(enableTarget);
  },
  Disable(state: IState, args: string[]) {
    const disableTarget = (WebGLRenderingContext as any)[args[0]];
    if (typeof disableTarget !== "number") {
      throw new Error(`Unknown WebGL constant "${args[0]}" was specified on @Disable`);
    }
    const index = state.enable.indexOf(disableTarget);
    if (index !== -1) {
      state.enable.splice(index, 1);
    }
  },
  BlendFunc(state: IState, args: string[]) {
    const config = asGLConstantArgs(args, 2);
    state.functions.blendFuncSeparate = [config[0], config[1], config[0], config[1]];
  },
  BlendFuncSeparate(state: IState, args: string[]) {
    state.functions.blendFuncSeparate = asGLConstantArgs(args, 4);
  },
  BlendEquation(state: IState, args: string[]) {
    const config = asGLConstantArgs(args, 1);
    state.functions.blendEquationSeparate = [config[0], config[0]];
  },
  BlendEquationSeparate(state: IState, args: string[]) {
    state.functions.blendEquationSeparate = asGLConstantArgs(args, 4);
  },
  BlendColor(state: IState, args: string[]) {
    state.functions.blendColor = asNumberArgs(args, 4);
  },
  ColorMask(state: IState, args: string[]) {
    state.functions.colorMask = asBooleanArgs(args, 4);
    state.enable.push(WebGLRenderingContext.COLOR_WRITEMASK);
  },
  CullFace(state: IState, args: string[]) {
    state.functions.cullFace = asGLConstantArgs(args, 1);
  },
  DepthFunc(state: IState, args: string[]) {
    state.functions.depthFunc = asGLConstantArgs(args, 1);
  },
  DepthRange(state: IState, args: string[]) {
    state.functions.depthRange = asNumberArgs(args, 2);
  },
  DepthMask(state: IState, args: string[]) {
    state.functions.depthMask = asBooleanArgs(args, 1);
  },
  FrontFace(state: IState, args: string[]) {
    state.functions.frontFace = asGLConstantArgs(args, 1);
  },
  LineWidth(state: IState, args: string[]) {
    state.functions.lineWidth = asNumberArgs(args, 1);
  },
  PolygonOffset(state: IState, args: string[]) {
    state.functions.polygonOffset = asNumberArgs(args, 2);
    state.enable.push(WebGLRenderingContext.POLYGON_OFFSET_FILL);
  },
  ExposeMacro() {
    return;
  },
  ReferMacro() {
    return;
  },
  Extension() {
    return;
  },
  DynamicState(state: IState, args: string[]) {
    if (!args.length) {
      throw new Error("DynamicState require at least 1 argument for specifying state resolver");
    }
    const resolver = args[0];
    args.splice(0, 1);
    state.dynamicState!.push({
      stateResolver: resolver,
      args,
    });
    return;
  },
};
