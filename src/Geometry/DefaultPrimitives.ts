import AABB from "grimoirejs-math/ref/AABB";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Geometry from "./Geometry";
import GeometryFactory from "./GeometryFactory";
import GeometryUtility from "./GeometryUtility";
import GLConstantUtility from "../Util/GLConstantUtility";

const unitBox = new AABB();
unitBox.expand(new Vector3(-1, -1, -1));
unitBox.expand(new Vector3(1, 1, 1));

const primitiveLayout = {
  POSITION: {
    size: 3,
    stride: 32,
  },
  NORMAL: {
    size: 3,
    stride: 32,
    offset: 12,
  },
  TEXCOORD: {
    size: 2,
    stride: 32,
    offset: 24,
  },
};

export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerQuad();
    DefaultPrimitives._registerCube();
    DefaultPrimitives._registerSphere();
    DefaultPrimitives._registerCircle();
    DefaultPrimitives._registerCylinder();
    DefaultPrimitives._registerCone();
    DefaultPrimitives._registerPlane();
    // DefaultPrimitives._registerTriangle();
    // DefaultPrimitives._registerCapsule();
  }

  private static _registerQuad(): void {
    GeometryFactory.addType("quad", {
    }, (geometry) => {
      geometry.addAttributeBuffer(GeometryUtility.plane([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], 1, 1), primitiveLayout);
      const indices = GeometryUtility.planeIndex(0, 1, 1)
      geometry.addIndexBuffer(indices, { semantic: "default" });
      geometry.addIndexBuffer(GeometryUtility.linesFromTriangles(indices), { semantic: "wireframe", topology: WebGLRenderingContext.LINES });
    });
  }
  private static _registerCone(): void {
    GeometryFactory.addType("cone", {
      divide: {
        converter: "Number",
        default: 50,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divide", 50);
      geometry.addReactiveAttributeBuffer(["divide"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.cone(attrs.divide);
        buffer.updateFromArray(bufferSource);
        return { accessors: primitiveLayout };
      });
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.coneIndex(attrs.divide);
        buffer.updateFromArray(bufferSource, false);
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attrs) => {
        let bufferSource = GeometryUtility.coneIndex(attrs.divide);
        bufferSource = GeometryUtility.linesFromTriangles(bufferSource);
        buffer.updateFromArray(bufferSource, false)
        return { semantic: "wireframe", topology: WebGLRenderingContext.LINES }
      });
    });
  }
  private static _registerCylinder(): void {
    GeometryFactory.addType("cylinder", {
      divide: {
        converter: "Number",
        default: 50,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divide", 50);
      geometry.addReactiveAttributeBuffer(["divide"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.cylinder(attrs.divide);
        buffer.updateFromArray(bufferSource);
        return { accessors: primitiveLayout };
      });
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.cylinderIndex(attrs.divide);
        buffer.updateFromArray(bufferSource, false)
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attrs) => {
        let bufferSource = GeometryUtility.cylinderIndex(attrs.divide);
        bufferSource = GeometryUtility.linesFromTriangles(bufferSource);
        buffer.updateFromArray(bufferSource, false)
        return { semantic: "wireframe", topology: WebGLRenderingContext.LINES }
      });
    });
  }
  private static _registerCube(): void {
    GeometryFactory.addType("cube", {
      divHorizontal: {
        converter: "Number",
        default: 1,
      },
      divVertical: {
        converter: "Number",
        default: 1,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divVertical", 1);
      geometry.declareReactiveAttribute("divHorizontal", 1);
      geometry.addReactiveAttributeBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.cube(attrs.divHorizontal, attrs.divVertical);
        buffer.updateFromArray(bufferSource);
        return { accessors: primitiveLayout };
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.cubeIndex(attrs.divHorizontal, attrs.divVertical);
        buffer.updateFromArray(bufferSource, false)
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        let bufferSource = GeometryUtility.cubeIndex(attrs.divHorizontal, attrs.divVertical);
        bufferSource = GeometryUtility.linesFromTriangles(bufferSource);
        buffer.updateFromArray(bufferSource, false)
        return { semantic: "wireframe", topology: WebGLRenderingContext.LINES }
      });
    });
  }
  private static _registerSphere(): void {
    GeometryFactory.addType("sphere", {
      divVertical: {
        converter: "Number",
        default: 50,
      },
      divHorizontal: {
        converter: "Number",
        default: 50,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divVertical", 50);
      geometry.declareReactiveAttribute("divHorizontal", 50);
      geometry.addReactiveAttributeBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.sphere([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], attrs.divVertical, attrs.divHorizontal);
        buffer.updateFromArray(bufferSource);
        return {
          accessors: primitiveLayout
        }
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        const bufferSource = GeometryUtility.sphereIndex(0, attrs.divVertical, attrs.divHorizontal);
        buffer.updateFromArray(bufferSource, false)
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attrs) => {
        let bufferSource = GeometryUtility.sphereIndex(0, attrs.divVertical, attrs.divHorizontal);
        bufferSource = GeometryUtility.linesFromTriangles(bufferSource);
        buffer.updateFromArray(bufferSource, false)
        return { semantic: "wireframe", topology: WebGLRenderingContext.LINES }
      });
    });
  }
  private static _registerCircle(): void {
    GeometryFactory.addType("circle", {
      divide: {
        converter: "Number",
        default: 30,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divide", 30);
      geometry.addReactiveAttributeBuffer(["divide"], (buffer, attr) => {
        const bufferSource = GeometryUtility.circle([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], attr.divide);
        buffer.updateFromArray(bufferSource);
        return {
          accessors: primitiveLayout
        }
      })
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attr) => {
        const bufferSource = GeometryUtility.circleIndex(0, attr.divide);
        buffer.updateFromArray(bufferSource, false)
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divide"], (buffer, attr) => {
        let bufferSource = GeometryUtility.circleIndex(0, attr.divide);
        bufferSource = GeometryUtility.linesFromTriangles(bufferSource);
        buffer.updateFromArray(bufferSource, false)
        return { semantic: "wireframe", topology: WebGLRenderingContext.LINES }
      });
    });
  }
  private static _registerPlane(): void {
    GeometryFactory.addType("plane", {
      divVertical: {
        converter: "Number",
        default: 10,
      },
      divHorizontal: {
        converter: "Number",
        default: 10,
      },
    }, (geometry) => {
      geometry.declareReactiveAttribute("divVertical", 10);
      geometry.declareReactiveAttribute("divHorizontal", 10);
      geometry.addReactiveAttributeBuffer(["divVertical", "divHorizontal"], (buffer, attr) => {
        const vertices = [].concat.apply([], [
          GeometryUtility.plane([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], attr.divHorizontal, attr.divVertical),
          GeometryUtility.plane([0, 0, 0], [0, 0, -1], [0, 1, 0], [-1, 0, 0], attr.divHorizontal, attr.divVertical, true),
        ]);
        buffer.updateFromArray(vertices);
        return {
          accessors: primitiveLayout
        };
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attr) => {
        const indices = [].concat.apply([], [
          GeometryUtility.planeIndex(0, attr.divHorizontal, attr.divVertical),
          GeometryUtility.planeIndex((attr.divHorizontal + 1) * (attr.divVertical + 1), attr.divHorizontal, attr.divVertical),
        ]);
        buffer.updateFromArray(indices, false);
        return {
          semantic: "default"
        };
      });
      geometry.addReactiveIndexBuffer(["divVertical", "divHorizontal"], (buffer, attr) => {
        const indices = [].concat.apply([], [
          GeometryUtility.planeIndex(0, attr.divHorizontal, attr.divVertical),
          GeometryUtility.planeIndex((attr.divHorizontal + 1) * (attr.divVertical + 1), attr.divHorizontal, attr.divVertical),
        ]);
        buffer.updateFromArray(GeometryUtility.linesFromTriangles(indices), false);
        return {
          semantic: "wireframe"
        };
      });
    });
  }
  // private static _registerCapsule(): void {
  //   GeometryFactory.addType("capsule", {
  //     divide: {
  //       converter: "Number",
  //       default: 50,
  //     },
  //   }, (gl, attrs) => {
  //     const dH = attrs["divide"] as number;
  //     const dV = dH % 2 === 1 ? dH + 1 : dH;

  //     const geometry = new Geometry(gl);
  //     geometry.addAttributes(GeometryUtility.capsule([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], dV, dH), primitiveLayout);
  //     geometry.addIndex("default", GeometryUtility.sphereIndex(0, dV, dH));
  //     geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.sphereIndex(0, dV, dH)), WebGLRenderingContext.LINES);
  //     return geometry;
  //   });
  // }
  // private static _registerTriangle(): void {
  //   GeometryFactory.addType("triangle", {
  //   }, (gl, attrs) => {
  //     const geometry = new Geometry(gl);
  //     geometry.addAttributes(GeometryUtility.triangle([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]), primitiveLayout);
  //     geometry.addIndex("default", GeometryUtility.triangleIndex(0));
  //     geometry.addIndex("wireframe", GeometryUtility.linesFromTriangles(GeometryUtility.triangleIndex(0)), WebGLRenderingContext.LINES);
  //     return geometry;
  //   });
  // }
}
