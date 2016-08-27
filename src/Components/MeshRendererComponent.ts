import GeometryRegistory from "./GeometryRegistoryComponent";
import IRenderMessageArgs from "../Camera/IRenderMessageArgs";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

import fs from "../TestShader/Sample_frag.glsl";
import vs from "../TestShader/Sample_vert.glsl";

export default class MeshRenderer extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    geometry: {
      converter: "string",
      defaultValue: "quad"
    }
  };

  public prog: Program;
  public geom: Geometry;
  private _transformComponent: TransformComponent;

  public $awake() {
    this.geom = (this.companion.get("GeometryRegistory") as GeometryRegistory).getGeometry(this.getValue("geometry")); // geometry attribute should use geometry converter
    const fshader: Shader = new Shader(this.companion.get("gl"), WebGLRenderingContext.FRAGMENT_SHADER, fs);
    const vshader: Shader = new Shader(this.companion.get("gl"), WebGLRenderingContext.VERTEX_SHADER, vs);
    this.prog = new Program(this.companion.get("gl"));
    this.prog.update([fshader, vshader]);
  }
  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
  }

  public $render(args: IRenderMessageArgs) {
    this.prog.use();
    this.prog.uniforms.uniformMatrix("_matPVW", this._transformComponent.calcPVW(args.camera.camera));
    this.geom.draw("wireframe", ["position"], this.prog);
    this.companion.get("gl").flush();
  }
}
