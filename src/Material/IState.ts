interface IState {
  enable: number[]; // empty by default
  disable?: number[];
  functions: {
    blendColor?: number[],
    blendEquationSeparate?: number[],
    blendFuncSeparate?: number[],
    colorMask?: boolean[], // (red, green, blue, alpha)
    cullFace?: number[], // BACK
    depthFunc?: number[], // LESS
    depthMask?: boolean[],
    depthRange?: number[], // (zNear, zFar)
    frontFace?: number[], // CCW
    lineWidth?: number[],
    polygonOffset?: number[], // (factor, units)
    scissor?: number[] // (x, y, width, height)
  };
}

export default IState;
