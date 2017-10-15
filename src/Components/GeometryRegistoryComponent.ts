import Component from "grimoirejs/ref/Core/Component";
import Identity from "grimoirejs/ref/Core/Identity";
import Namespace from "grimoirejs/ref/Core/Namespace";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import Geometry from "../Geometry/Geometry";
import GeometryFactory from "../Geometry/GeometryFactory";
import { __NAMESPACE__ } from "../metaInfo";
import CanvasInitializerComponent from "./CanvasInitializerComponent";

const ns = Namespace.define(__NAMESPACE__);

/**
 * ジオメトリを管理するコンポーネント
 * あまりユーザーが直接操作することはありません。
 */
export default class GeometryRegistoryComponent extends Component {
  public static componentName = "GeometryRegistory";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * デフォルトで生成するジオメトリの種類
     */
    defaultGeometry: {
      converter: "StringArray",
      default: ["quad", "cube", "sphere"],
    },
  };

  public static COMPANION_KEY_GEOMETRY_REGISTORY = ns.for(GeometryRegistoryComponent.componentName);

  private _geometryResolver: NameResolver<Geometry> = new NameResolver<Geometry>();

  public async addGeometry(name: string, geometry: Promise<Geometry> | Geometry): Promise<void> {
    await this._geometryResolver.register(name, geometry);
  }

  public async getGeometry(name: string): Promise<Geometry> {
    return this._geometryResolver.get(name);
  }

  protected $awake(): void {
    this.companion.set(GeometryRegistoryComponent.COMPANION_KEY_GEOMETRY_REGISTORY, this);
    const factory = GeometryFactory.get(this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL));
    for (const geometry of this.getAttribute<string[]>("defaultGeometry")) {
      this.addGeometry(geometry, factory.instanciateAsDefault(geometry));
    }
  }
}
