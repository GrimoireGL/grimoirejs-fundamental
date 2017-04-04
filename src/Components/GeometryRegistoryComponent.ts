import gr from "grimoirejs";
import GeometryFactory from "../Geometry/GeometryFactory";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/ref/Node/Component";
import GrimoireInterface from "grimoirejs";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";

/**
 * ジオメトリを管理するコンポーネント
 * あまりユーザーが直接操作することはありません。
 */
export default class GeometryRegistoryComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        /**
         * デフォルトで生成するジオメトリの種類
         */
        defaultGeometry: {
            converter: "StringArray",
            default: ["quad", "cube", "sphere"]
        }
    };

    private _factory: GeometryFactory;

    private _geometryResolver: NameResolver<Geometry> = new NameResolver<Geometry>();

    public $awake(): void {
        this._factory = new GeometryFactory(this.companion.get("gl"));
        this.companion.set(this.name, this);
        this.companion.set(GrimoireInterface.ns(this.name.ns)("GeometryFactory"), this._factory);
        for (let geometry of this.getAttribute("defaultGeometry") as string[]) {
            this.addGeometry(geometry, this._factory.instanciateAsDefault(geometry));
        }
    }

    public addGeometry(name: string, geometry: Promise<Geometry> | Geometry): void {
        this._geometryResolver.register(name, geometry);
    }

    public getGeometry(name: string): Promise<Geometry> {
        return this._geometryResolver.get(name);
    }
}
