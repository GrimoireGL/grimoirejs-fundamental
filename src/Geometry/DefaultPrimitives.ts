import {Vector3} from "grimoirejs-math";
import GeometryUtility from "./GeometryUtility";
import GeometryFactory from "./GeometryFactory";
import GeometryBuilder from "./GeometryBuilder";
// TODO add normal and uvs
// TODO apply attributes
export default class DefaultPrimitives {
  public static register(): void {
    DefaultPrimitives._registerTriangle();
    DefaultPrimitives._registerQuad();
    DefaultPrimitives._registerCube();
    DefaultPrimitives._registerSphere();
    DefaultPrimitives._registerCircle();
    DefaultPrimitives._registerCylinder();
    DefaultPrimitives._registerCone();
    DefaultPrimitives._registerPlane();
  }

  private static _registerTriangle(): void {
    GeometryFactory.addType("triangle", {
    }, (gl, attrs) => {
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.triangleIndex(0);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.triangleIndex(0));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.triangleSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.trianglePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit);
                },
                normal: function* () {
                  yield* GeometryUtility.triangleNormal(Vector3.ZUnit);
                },
                uv: function* () {
                  yield* GeometryUtility.triangleUV();
                }
              };
            }
          }
        }
      });
    });
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
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.quadSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.quadPosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit);
                },
                normal: function* () {
                  yield* GeometryUtility.quadNormal(Vector3.ZUnit);
                },
                uv: function* () {
                  yield* GeometryUtility.quadUV();
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
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.cubeSize(),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.cubePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis());
                },
                normal: function* () {
                  yield* GeometryUtility.cubeNormal(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis());
                },
                uv: function* () {
                  yield* GeometryUtility.cubeUV();
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
        converter: "Number",
        defaultValue: 100
      },
      divHorizontal: {
        converter: "Number",
        defaultValue: 100
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
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.sphereSize(dH, dV),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.spherePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), dH, dV);
                },
                normal: function* () {
                  yield* GeometryUtility.sphereNormal(Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), dH, dV);
                },
                uv: function* () {
                  yield* GeometryUtility.sphereUV(dH, dV);
                }
              };
            }
          }
        }
      });
    });
  }
  private static _registerCircle(): void {
    GeometryFactory.addType("circle", {
      divide: {
        converter: "Number",
        defaultValue: 50
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.ellipseIndex(0, div);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.ellipseIndex(0, div));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.ellipseSize(div),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.ellipsePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, div);
                },
                normal: function* () {
                  yield* GeometryUtility.ellipseNormal(Vector3.ZUnit, div);
                },
                uv: function* () {
                  yield* GeometryUtility.ellipseUV(div);
                }
              };
            }
          }
        }
      });
    });
  }

  private static _registerCylinder(): void {
    GeometryFactory.addType("cylinder", {
      divide: {
        converter: "Number",
        defaultValue: 50
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.cylinderIndex(0, div);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.cylinderIndex(0, div));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.cylinderSize(div),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.cylinderPosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
                },
                normal: function* () {
                  yield* GeometryUtility.cylinderNormal(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
                },
                uv: function* () {
                  yield* GeometryUtility.cylinderUV(div);
                }
              };
            }
          }
        }
      });
    });
  }
  private static _registerCone(): void {
    GeometryFactory.addType("cone", {
      divide: {
        converter: "Number",
        defaultValue: 50
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.coneIndex(0, div);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.coneIndex(0, div));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.coneSize(div),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.conePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
                },
                normal: function* () {
                  yield* GeometryUtility.coneNormal(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis(), div);
                },
                uv: function* () {
                  yield* GeometryUtility.coneUV(div);
                }
              };
            }
          }
        }
      });
    });
  }
  private static _registerPlane(): void {
    GeometryFactory.addType("plane", {
      divide: {
        converter: "Number",
        defaultValue: 10
      }
    }, (gl, attrs) => {
      const div = attrs["divide"];
      return GeometryBuilder.build(gl, {
        indicies: {
          default: {
            generator: function* () {
              yield* GeometryUtility.planeIndex(0, div);
            },
            topology: WebGLRenderingContext.TRIANGLES
          },
          wireframe: {
            generator: function* () {
              yield* GeometryUtility.linesFromTriangles(GeometryUtility.planeIndex(0, div));
            },
            topology: WebGLRenderingContext.LINES
          }
        },
        verticies: {
          main: {
            size: {
              position: 3,
              normal: 3,
              uv: 2
            },
            count: GeometryUtility.planeSize(div),
            getGenerators: () => {
              return {
                position: function* () {
                  yield* GeometryUtility.planePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, div);
                },
                normal: function* () {
                  yield* GeometryUtility.planeNormal(Vector3.ZUnit, div);
                },
                uv: function* () {
                  yield* GeometryUtility.planeUV(div);
                }
              };
            }
          }
        }
      });
    });
  }
}
