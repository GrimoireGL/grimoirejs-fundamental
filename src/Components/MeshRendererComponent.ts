import Geometry from "../Geometry/Geometry";
import Program from "../Resource/Program";
import GeometryBuilder from "../Geometry/GeometryBuilder";
import Shader from "../Resource/Shader";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

import fs from "../TestShader/Sample_frag.glsl";
import vs from "../TestShader/Sample_vert.glsl";

export default class MeshRenderer extends Component {
  public prog: Program;
  public geom: Geometry;
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public $awake() {
    this.geom = GeometryBuilder.build(this.sharedObject.get("gl"), {
      index: function* () {
        yield* [0, 1, 2];
      },
      verticies: {
        main: {
          size: {
            position: 3,
            normal: 3,
          },
          count: 3,
          getGenerators: () => {
            return {
              position: function* () {
                yield* [0, 0, 0];
                yield* [1, 0, 0];
                yield* [0, -1, 0];
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
    const fshader: Shader = new Shader(this.sharedObject.get("gl"), WebGLRenderingContext.FRAGMENT_SHADER, fs);
    const vshader: Shader = new Shader(this.sharedObject.get("gl"), WebGLRenderingContext.VERTEX_SHADER, vs);
    this.prog = new Program(this.sharedObject.get("gl"));
    this.prog.update([fshader, vshader]);
  }

  public $render() {
    this.geom.draw(["position"], this.prog);
    this.sharedObject.get("gl").flush();
  }
}
