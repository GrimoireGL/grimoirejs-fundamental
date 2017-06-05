import Geometry from "./Geometry";

interface IGeometryFactoryDelegate {
  (gl: WebGLRenderingContext, geometryArgs: { [key: string]: any }): Promise<Geometry> | Geometry;
}

export default IGeometryFactoryDelegate;
