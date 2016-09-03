import ITransformingInfo from "./ITransformingInfo";

interface GLConfigAnnotation {
  name: string;
  args: string[];
}

function* _regexGLConfigs(source: string): IterableIterator<GLConfigAnnotation> {
  const regex = /@([a-zA-Z]+)\(([^)]*)\)/g;
  let regexResult: RegExpExecArray;
  while ((regexResult = regex.exec(source))) {
    yield {
      name: regexResult[1],
      args: regexResult[2].split(",")
    };
  }
}

function _enablingFunc(target: number, enabled: boolean): (gl: WebGLRenderingContext) => void {
  if (enabled) {
    return (gl: WebGLRenderingContext) => {
      gl.enable(target);
    };
  } else {
    return (gl: WebGLRenderingContext) => {
      gl.disable(target);
    };
  }
}

function _asGLConstants(args: string[], length: number): number[] {
  if (args.length !== length) {
    throw new Error(`The arguments should contain ${length} of items but there was ${args.length}`);
  }
  return args.map(arg => {
    const value = WebGLRenderingContext[arg.toUpperCase()];
    if (value) {
      return value;
    } else {
      throw new Error(`Specified WebGL constant ${arg} was not found`);
    }
  });
}

function _parseGLConfigs(source: string): ((gl: WebGLRenderingContext) => void)[] {
  const configs = _regexGLConfigs(source);
  let configResult: IteratorResult<GLConfigAnnotation>;
  const result: ((gl: WebGLRenderingContext) => void)[] = [];
  let depthEnabled = true, blendEnabled = true, cullEnabled = true;
  while ((configResult = configs.next())) {
    if (configResult.done) {
      break;
    }
    const config = configResult.value;
    switch (config.name) {
      case "NoDepth":
        depthEnabled = false;
        break;
      case "DepthFunc":
        depthEnabled = true;
        const depth = _asGLConstants(config.args, 1);
        result.push((gl) => {
          gl.depthFunc(depth[0]);
        });
        break;
      case "NoBlend":
        blendEnabled = false;
        break;
      case "NoCull":
        cullEnabled = false;
        break;
      case "CullFace":
        cullEnabled = true;
        const cullConfig = _asGLConstants(config.args, 1);
        result.push((gl) => {
          gl.cullFace(cullConfig[0]);
        });
        break;
      case "BlendFunc":
        blendEnabled = true;
        const blendFuncConfig = _asGLConstants(config.args, 2);
        result.push((gl) => {
          gl.blendFunc(blendFuncConfig[0], blendFuncConfig[1]);
        });
        break;
      case "BlendFuncSeparate":
        blendEnabled = true;
        const blendFuncSeparate = _asGLConstants(config.args, 4);
        result.push((gl) => {
          gl.blendFuncSeparate(blendFuncSeparate[0], blendFuncSeparate[1], blendFuncSeparate[2], blendFuncSeparate[3]);
        });
        break;
      case "BlendEquation":
        blendEnabled = true;
        const blendEquation = _asGLConstants(config.args, 1);
        result.push((gl) => {
          gl.blendEquation(blendEquation[0]);
        });
        break;
      case "BlendEquationSeparate":
        blendEnabled = true;
        const blendEquationSeparate = _asGLConstants(config.args, 2);
        result.push((gl) => {
          gl.blendEquationSeparate(blendEquationSeparate[0], blendEquationSeparate[1]);
        });
        break;
    }
  }
  result.unshift(_enablingFunc(WebGLRenderingContext.DEPTH_TEST, depthEnabled));
  result.unshift(_enablingFunc(WebGLRenderingContext.BLEND, blendEnabled));
  result.unshift(_enablingFunc(WebGLRenderingContext.CULL_FACE, cullEnabled));
  return result;
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  input.info.configurator = _parseGLConfigs(input.transforming);
  return input;
}
