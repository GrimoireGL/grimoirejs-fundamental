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

function _asNumberArray(args: string[]): number[] {
  return args.map(arg => Number.parseFloat(arg));
}

function _asBooleanArray(args: string[]): boolean[] {
  return args.map(arg => Boolean(arg));
}

function _parseGLConfigs(source: string): ((gl: WebGLRenderingContext) => void)[] {
  const configs = _regexGLConfigs(source);
  let configResult: IteratorResult<GLConfigAnnotation>;
  const result: ((gl: WebGLRenderingContext) => void)[] = [];
  while ((configResult = configs.next())) {
    if (configResult.done) {
      break;
    }
    const config = configResult.value;
    switch (config.name) {
      case "NoDepth":
        result.push((gl) => gl.disable(WebGLRenderingContext.DEPTH_TEST));
        break;
      case "Depth":
        let depthFunc = WebGLRenderingContext[config.args[0].toUpperCase()];
        depthFunc = depthFunc ? depthFunc : WebGLRenderingContext.LEQUAL; // default value is lequal
        result.push((gl) => {
          gl.enable(WebGLRenderingContext.DEPTH_TEST);
          gl.depthMask(depthFunc);
        });
        break;
      case "NoBlend":
        result.push((gl) => gl.disable(WebGLRenderingContext.BLEND));
        break;
      case "NoCull":
        result.push((gl) => gl.disable(WebGLRenderingContext.CULL_FACE));
        break;
      case "Enable":
        const flag1 = WebGLRenderingContext[config.args[0].toUpperCase()];
        if (flag1) {
          result.push((gl) => gl.enable(flag1));
        }
        break;
      case "Disable":
        const flag2 = WebGLRenderingContext[config.args[0].toUpperCase()];
        if (flag2) {
          result.push((gl) => gl.enable(flag2));
        }
        break;
    }
  }
  return result;
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  input.info.configurator = _parseGLConfigs(input.transforming);
  return input;
}
