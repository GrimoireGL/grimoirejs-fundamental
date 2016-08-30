import {Vector3} from "grimoirejs-math";
import GeometryUtility from "./GeometryUtility";
import GeometryFactory from "./GeometryFactory";
import GeometryBuilder from "./GeometryBuilder";
// TODO add normal and uvs
// TODO apply attributes
export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerQuad();
    DefaultPrimitives._registerCube();
    DefaultPrimitives._registerSphere();
  }

  private static _registerQuad(): void {
    GeometryFactory.addType("quad", {
    }, (gl, attrs) => {
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.quadIndex(0);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.quadIndex(0));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3
            },
            count: GeometryUtility.quadSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.quadPosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit);
                }
              };
            }
          }
        }
      });
    });

  }

  private static _registerCube(): void {
    GeometryFactory.addType("cube", {
    }, (gl, attrs) => {
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.cubeIndex(0);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.cubeIndex(0));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3
            },
            count: GeometryUtility.cubeSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.cubePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis());
                }
              };
            }
          }
        }
      });
    });
  }

  private static _registerSphere(): void {
    GeometryFactory.addType("sphere", {
      divVertical: {
        converter: "number",
        defaultValue: 10
      },
      divHorizontal: {
        converter: "number",
        defaultValue: 10
      }
    }, (gl, attrs) => {
      const dH = attrs["divHorizontal"];
      const dV = attrs["divVertical"];
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.sphereIndex(0, dH, dV);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.sphereIndex(0, dH, dV));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3
            },
            count: GeometryUtility.sphereSize(dH, dV),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.spherePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), dH, dV);
                }
              };
            }
          }
        }
      });
    });
  }
}
