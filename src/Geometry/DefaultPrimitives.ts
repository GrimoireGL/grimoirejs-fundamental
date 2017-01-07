import Geometry from "./Geometry";
import AABB from "grimoirejs-math/ref/AABB";
import Vector3 from "grimoirejs-math/ref/Vector3";
import GeometryUtility from "./GeometryUtility";
import GeometryFactory from "./GeometryFactory";

const unitBox = new AABB();
unitBox.expand(new Vector3(-1, -1, -1));
unitBox.expand(new Vector3(1, 1, 1));

const primitiveLayout = {
  POSITION: {
    size: 3,
    stride: 32
  },
  NORMAL: {
    size: 3,
    stride: 32,
    offset: 12
  },
  TEXCOORD: {
    size: 2,
    stride: 32,
    offset: 24
  }
};

export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerQuad();
    DefaultPrimitives._registerCube();
    DefaultPrimitives._registerSphere();
    DefaultPrimitives._registerCircle();
    DefaultPrimitives._registerCylinder();
    // DefaultPrimitives._registerCone();
    // DefaultPrimitives._registerPlane();
  }

  private static _registerQuad(): void {
    GeometryFactory.addType("quad", {
    }, (gl, attrs) => {
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.plane([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], 1, 1), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.planeIndex(0, 1, 1));
      return geometry;
    });
  }
  private static _registerCylinder(): void {
    GeometryFactory.addType("cylinder", {
      divide: {
        converter: "Number",
        default: 30
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      const geometry = new Geometry(gl);
      const theta = div % 2 != 0 ? Math.PI / div : 0;
      const vertices = [].concat.apply([], [
        GeometryUtility.circle([0, 1, 0], [0, 0, 1], [0, 0, -1], [1, 0, 0], div),
        GeometryUtility.circle([0, -1, 0], [0, 0, 1], [-Math.sin(theta), 0, Math.cos(theta)], [Math.cos(theta), 0, Math.sin(theta)], div),
      ]);
      const length = Math.sin(Math.PI / div);
      const radius = Math.cos(Math.PI / div);
      const s = Math.PI / div;
      for (let i = 0; i < div; i++) {
        let step = s * (i * 2 + 1);
        Array.prototype.push.apply(vertices, GeometryUtility.plane([-Math.sin(step) * radius, 0, -Math.cos(step) * radius], [0, 0, 1], [0, 1, 0], [-Math.cos(step) * length, 0, Math.sin(step) * length], 1, 1));
      }
      geometry.addAttributes(vertices, primitiveLayout);
      const os = div + 2;
      const indices = [].concat.apply([], [
        GeometryUtility.circleIndex(0, div),
        GeometryUtility.circleIndex(os, div)
      ]);
      for (let i = 0; i < div; i++) {
        Array.prototype.push.apply(indices, GeometryUtility.planeIndex(os * 2 + i * 4, 1, 1));
      }
      geometry.addIndex("default", indices);
      return geometry;
    });
  }
  private static _registerCube(): void {
    GeometryFactory.addType("cube", {
      divHorizontal: {
        converter: "Number",
        default: 1
      },
      divVertical: {
        converter: "Number",
        default: 1
      }
    }, (gl, attrs) => {
      const hdiv = attrs["divHorizontal"];
      const vdiv = attrs["divVertical"];
      const geometry = new Geometry(gl);
      const vertices = [].concat.apply([], [
        GeometryUtility.plane([0, 0, 1], [0, 0, 1], [0, 1, 0], [1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, 0, -1], [0, 0, -1], [0, 1, 0], [-1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, 1, 0], [0, 1, 0], [0, 0, -1], [1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([0, -1, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0], hdiv, vdiv),
        GeometryUtility.plane([1, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, -1], hdiv, vdiv),
        GeometryUtility.plane([-1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, 0, 1], hdiv, vdiv)]);
      geometry.addAttributes(vertices, primitiveLayout);
      const os = (hdiv + 1) * (vdiv + 1);
      const indices = [].concat.apply([], [
        GeometryUtility.planeIndex(0, hdiv, vdiv),
        GeometryUtility.planeIndex(os, hdiv, vdiv),
        GeometryUtility.planeIndex(2 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(3 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(4 * os, hdiv, vdiv),
        GeometryUtility.planeIndex(5 * os, hdiv, vdiv)]);
      geometry.addIndex("default", indices);
      return geometry;
    });
  }
  private static _registerSphere(): void {
    GeometryFactory.addType("sphere", {
      divVertical: {
        converter: "Number",
        default: 100
      },
      divHorizontal: {
        converter: "Number",
        default: 100
      }
    }, (gl, attrs) => {
      const dH = attrs["divHorizontal"];
      const dV = attrs["divVertical"];
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.sphere([0, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, -1], dV, dH), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.sphereIndex(0, dV, dH));
      return geometry;
    });
  }
  private static _registerCircle(): void {
    GeometryFactory.addType("circle", {
      divide: {
        converter: "Number",
        default: 10
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      const geometry = new Geometry(gl);
      geometry.addAttributes(GeometryUtility.circle([0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], div), primitiveLayout);
      geometry.addIndex("default", GeometryUtility.circleIndex(0, div));
      return geometry;
    });
  }
  //
  // private static _registerCylinder(): void {
  //   GeometryFactory.addType("cylinder", {
  //     divide: {
  //       converter: "Number",
  //       default: 50
  //     }
  //   }, (gl, attrs) => {
  //     const div = attrs["divide"];
  //     return GeometryBuilder.build(gl, {
  //       indices: {
  //         default: {
  //           generator: function* () {
  //             yield* GeometryUtility.cylinderIndex(0, div);
  //           },
  //           topology: WebGLRenderingContext.TRIANGLES
  //         },
  //         wireframe: {
  //           generator: function* () {
  //             yield* GeometryUtility.linesFromTriangles(GeometryUtility.cylinderIndex(0, div));
  //           },
  //           topology: WebGLRenderingContext.LINES
  //         }
  //       },
  //       vertices: {
  //         main: {
  //           size: {
  //             POSITION: 3,
  //             NORMAL: 3,
  //             TEXCOORD: 2
  //           },
  //           count: GeometryUtility.cylinderSize(div),
  //           getGenerators: () => {
  //             return {
  //               POSITION: function* () {
  //                 yield* GeometryUtility.cylinderPosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
  //               },
  //               NORMAL: function* () {
  //                 yield* GeometryUtility.cylinderNormal(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
  //               },
  //               TEXCOORD: function* () {
  //                 yield* GeometryUtility.cylinderTexCoord(div);
  //               }
  //             };
  //           }
  //         }
  //       },
  //       aabb: unitBox
  //     });
  //   });
  // }
  // private static _registerCone(): void {
  //   GeometryFactory.addType("cone", {
  //     divide: {
  //       converter: "Number",
  //       default: 50
  //     }
  //   }, (gl, attrs) => {
  //     const div = attrs["divide"];
  //     return GeometryBuilder.build(gl, {
  //       indices: {
  //         default: {
  //           generator: function* () {
  //             yield* GeometryUtility.coneIndex(0, div);
  //           },
  //           topology: WebGLRenderingContext.TRIANGLES
  //         },
  //         wireframe: {
  //           generator: function* () {
  //             yield* GeometryUtility.linesFromTriangles(GeometryUtility.coneIndex(0, div));
  //           },
  //           topology: WebGLRenderingContext.LINES
  //         }
  //       },
  //       vertices: {
  //         main: {
  //           size: {
  //             POSITION: 3,
  //             NORMAL: 3,
  //             TEXCOORD: 2
  //           },
  //           count: GeometryUtility.coneSize(div),
  //           getGenerators: () => {
  //             return {
  //               POSITION: function* () {
  //                 yield* GeometryUtility.conePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
  //               },
  //               NORMAL: function* () {
  //                 yield* GeometryUtility.coneNormal(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
  //               },
  //               TEXCOORD: function* () {
  //                 yield* GeometryUtility.coneTexCoord(div);
  //               }
  //             };
  //           }
  //         }
  //       },
  //       aabb: unitBox
  //     });
  //   });
  // }
  // private static _registerPlane(): void {
  //   GeometryFactory.addType("plane", {
  //     divide: {
  //       converter: "Number",
  //       default: 10
  //     }
  //   }, (gl, attrs) => {
  //     const div = attrs["divide"];
  //     return GeometryBuilder.build(gl, {
  //       indices: {
  //         default: {
  //           generator: function* () {
  //             yield* GeometryUtility.planeIndex(0, div);
  //           },
  //           topology: WebGLRenderingContext.TRIANGLES
  //         },
  //         wireframe: {
  //           generator: function* () {
  //             yield* GeometryUtility.linesFromTriangles(GeometryUtility.planeIndex(0, div));
  //           },
  //           topology: WebGLRenderingContext.LINES
  //         }
  //       },
  //       vertices: {
  //         main: {
  //           size: {
  //             POSITION: 3,
  //             NORMAL: 3,
  //             TEXCOORD: 2
  //           },
  //           count: GeometryUtility.planeSize(div),
  //           getGenerators: () => {
  //             return {
  //               POSITION: function* () {
  //                 yield* GeometryUtility.planePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, div);
  //               },
  //               NORMAL: function* () {
  //                 yield* GeometryUtility.planeNormal(Vector3.ZUnit, div);
  //               },
  //               TEXCOORD: function* () {
  //                 yield* GeometryUtility.planeTexCoord(div);
  //               }
  //             };
  //           }
  //         }
  //       }
  //     });
  //   });
  // }
}
