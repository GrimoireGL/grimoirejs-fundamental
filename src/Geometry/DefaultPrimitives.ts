import {Vector3} from "grimoirejs-math";
import GeometryUtility from "./GeometryUtility";
import GeometryFactory from "./GeometryFactory";
import GeometryBuilder from "./GeometryBuilder";
export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerCube();
  }

  private static _registerCube(): void {
    GeometryFactory.addType("cube", {
      divX: {
        converter: "number",
        defaultValue: 1
      }
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
              position: 3,
              normal: 3,
            },
            count: GeometryUtility.cubeSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.cubePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis());
                },
                normal: function* () {
                  while (true) {
                    yield* [0, 0, 1];
                  }
                }
              };
            }
          }
        }
      });
    });
  }
}
