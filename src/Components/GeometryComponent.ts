import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Geometry from "../Geometry/Geometry";
import GeometryFactory from "../Geometry/GeometryFactory";
import GeometryRegistory from "./GeometryRegistoryComponent";
/**
 * ジオメトリを生成するためのコンポーネント
 * `type`属性に指定されたタイプのジオメトリを生成して、`name`属性に指定された名前で利用できる形にして登録します。
 * このコンポーネントは`type`属性に応じて、**動的** に属性が増えることに気をつけてください。
 */
export default class GeometryComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        /**
         * 生成するプリミティブのタイプ
         *
         * `GeometryFactory`に登録されたプリミティブのジェネレーターの名前を指します。
         * この指定する名前によって、動的に属性が増えることに気をつけてください。
         * また、増えたジオメトリの属性は動的に操作できないことに気をつけてください。
         */
        type: {
            converter: "String",
            default: null,
        },
        /**
         * ジオメトリにつける名前
         *
         * `GeometryConverter`によって取得される際に利用されるジオメトリ名です。
         * もし、`quad`など事前に登録されたジオメトリを指定した場合、そのジオメトリを上書きすることができます。
         */
        name: {
            converter: "String",
            default: null,
        },
    };

    public geometry: Geometry;

    public async $mount(): Promise<void> {
        const type = this.getAttribute("type");
        if (type) {
            const gf = GeometryFactory.get(this.companion.get("gl"));
            const attrs = GeometryFactory.factoryArgumentDeclarations[type];
            const geometryArgument = {};
            for (const key in attrs) {
                this.__addAttribute(key, attrs[key]);
                geometryArgument[key] = this.getAttribute(key);
            }
            const generator = gf.instanciate(type, geometryArgument);
            const gr = this.companion.get("GeometryRegistory") as GeometryRegistory;
            const name = this.getAttribute("name");
            if (!name) {
                throw new Error("Name was not specified");
            }
            gr.addGeometry(name, generator);
            this.geometry = await generator;
        }
    }
}
