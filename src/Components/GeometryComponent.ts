import GeometryRegistory from "./GeometryRegistoryComponent";
import GeometryFactory from "../Geometry/GeometryFactory";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class GeometryComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "string",
      defaultValue: undefined
    },
    name: {
      converter: "string",
      defaultValue: undefined
    }
  };

  public geometry: Geometry;

  public $mount(): void {
    const type = this.getValue("type");
    if (type) {
      const gf = this.companion.get("GeometryFactory") as GeometryFactory;
      const attrs = GeometryFactory.factoryArgumentDeclarations[type];
      const geometryArgument = {};
      for (let key in attrs) {
        this.__addAtribute(key, attrs[key]);
        geometryArgument[key] = this.getValue(key);
      }
      this.geometry = gf.instanciate(type, geometryArgument);
      const gr = this.companion.get("GeometryRegistory") as GeometryRegistory;
      const name = this.getValue("name");
      if (!name) {
        throw new Error("Name was not specified");
      }
      gr.addGeometry(name, this.geometry);
    }
  }
}
