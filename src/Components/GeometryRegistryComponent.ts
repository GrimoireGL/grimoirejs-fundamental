import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import Geometry from "../Geometry/Geometry";
import GeometryFactory from "../Geometry/GeometryFactory";
import { attribute } from "grimoirejs/ref/Core/Decorator";

/**
 * Manage geometry instances of GOML hierarchy.
 */
export default class GeometryRegistryComponent extends Component {
  public static componentName = "GeometryRegistry";

  /**
   * Default geometry types to instanciate on initialization timing.
   * Specified geometries will be instanciated with default values on mount timing of this component.
   * You should specify this attribute on GOML if you needs to add new geometry.
   */
  @attribute("StringArray", ["quad", "cube", "sphere"])
  public defaultGeometry!: string[];

  /**
   * NameResolver for managing geometry referrences.
   */
  public resolver: NameResolver<Geometry> = new NameResolver<Geometry>();

  protected $awake(): void {
    this.companion.set(this.identity, this);
    const factory = GeometryFactory.get(this.companion.get("gl")!);
    for (const geometry of this.getAttribute("defaultGeometry") as string[]) {
      this.addGeometry(geometry, factory.instanciateAsDefault(geometry));
    }
  }

  /**
   * Set new Geometry instance with specified name.
   * @param name name of Geometry
   * @param geometry Geometry instance or Promise to resolve geometry
   */
  public addGeometry(name: string, geometry: Promise<Geometry> | Geometry): void {
    this.resolver.register(name, geometry);
  }

  /**
   * Obtain geometry referrence by specified geometry name.
   * @param name name of the geometry.
   */
  public getGeometry(name: string): Promise<Geometry> {
    return this.resolver.get(name);
  }
}
