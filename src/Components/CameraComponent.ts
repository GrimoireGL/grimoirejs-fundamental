import Geometry from "../Geometry/Geometry";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import GeometryBuilder from "../Geometry/GeometryBuilder";

import fs from "../TestShader/Sample_frag.glsl";
import vs from "../TestShader/Sample_vert.glsl";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  private containedScene: SceneComponent;

  private geom: Geometry;

  private prog: Program;

  public $awake(): void {
    this.containedScene = this._findContainedScene(this.node);
    console.log(this.containedScene);
    this.geom = GeometryBuilder.build(this.sharedObject.get("gl"), {
      index: function* () {
        yield 0;
        yield 1;
        yield 2;
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
    this.geom.use(["position"], this.prog);
  }

  private _findContainedScene(node: GomlNode): SceneComponent {
    return null;
    // if (node.parent) {
    //   const scene = this.node.getComponents();
    //   if (!scene) {
    //     return this._findContainedScene(node.parent);
    //   } else {
    //     return scene;
    //   }
    // } else {
    //   return null;
    // }
  }
}
