import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import Geometry from "../Geometry/Geometry";
import GeometryFactory from "../Geometry/GeometryFactory";

/**
 * ジオメトリを管理するコンポーネント
 * あまりユーザーが直接操作することはありません。
 */
export default class GeometryRegistryComponent extends Component {
  public static componentName = "GeometryRegistry";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * デフォルトで生成するジオメトリの種類
     */
    defaultGeometry: {
      converter: "StringArray",
      default: ["quad", "cube", "sphere"],
    },
  };

  public resolver: NameResolver<Geometry> = new NameResolver<Geometry>();

  protected $awake(): void {
    this.companion.set(this.name, this);
    const factory = GeometryFactory.get(this.companion.get("gl")!);
    for (const geometry of this.getAttribute("defaultGeometry") as string[]) {
      this.addGeometry(geometry, factory.instanciateAsDefault(geometry));
    }
  }

  public addGeometry(name: string, geometry: Promise<Geometry> | Geometry): void {
    this.resolver.register(name, geometry);
  }

  public getGeometry(name: string): Promise<Geometry> {
    return this.resolver.get(name);
  }
}
