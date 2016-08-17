import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import GeometryBuilder from "../Geometry/GeometryBuilder";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  private containedScene: SceneComponent;


  private geom: any;
  public $mount() {
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
            position: 3
          },
          count: 3,
          generator: function* () {
            yield 0;
            yield 0;
            yield 0;
            yield 1;
            yield 0;
            yield 0;
            yield 0;
            yield -1;
            yield 0
          }
        }
      }
    });
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
