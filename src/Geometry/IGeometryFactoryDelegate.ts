import Geometry from "./Geometry";

interface IGeometryFactoryDelegate {
    (geometry: Geometry): Promise<void> | void;
}

export default IGeometryFactoryDelegate;
