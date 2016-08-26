import Geometry from "./Geometry";
interface IGeometryFactoryDelegate {
  (gl: WebGLRenderingContext, geometryArgs: { [key: string]: any }): Geometry;
}

export default IGeometryFactoryDelegate;
