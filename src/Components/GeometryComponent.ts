import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Geometry from "../Geometry/Geometry";
import GeometryFactory from "../Geometry/GeometryFactory";
import GeometryRegistry from "./GeometryRegistryComponent";
import { Attribute, StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";

/**
 * ジオメトリを生成するためのコンポーネント
 * `type`属性に指定されたタイプのジオメトリを生成して、`name`属性に指定された名前で利用できる形にして登録します。
 * このコンポーネントは`type`属性に応じて、**動的** に属性が増えることに気をつけてください。
 */
export default class GeometryComponent extends Component {
    public static componentName = "Geometry";
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        /**
         * 生成するプリミティブのタイプ
         *
         * `GeometryFactory`に登録されたプリミティブのジェネレーターの名前を指します。
         * この指定する名前によって、動的に属性が増えることに気をつけてください。
         * また、増えたジオメトリの属性は動的に操作できないことに気をつけてください。
         */
        type: {
            converter: StringConverter,
            default: null,
        },
        /**
         * ジオメトリにつける名前
         *
         * `GeometryConverter`によって取得される際に利用されるジオメトリ名です。
         * もし、`quad`など事前に登録されたジオメトリを指定した場合、そのジオメトリを上書きすることができます。
         */
        name: {
            converter: StringConverter,
            default: null,
        },
    };

    public geometry!: Geometry;

    public async $mount(): Promise<void> {
        const type = this.getAttribute("type");
        if (type) {
            const gf = GeometryFactory.get(this.companion.get("gl")!);
            const attrs = GeometryFactory.factoryArgumentDeclarations[type];
            const geometryArgument = {} as { [key: string]: Attribute };
            for (const key in attrs) {
                const attr = this.__addAttribute(key, attrs[key]);
                geometryArgument[key] = this.getAttribute(key);
            }
            const generator = gf.instanciate(type, geometryArgument);
            for (const key in attrs) {
                const attr = this.getAttributeRaw(key) as StandardAttribute<any>;
                attr.watch(async (v: any) => (await this.geometry).setReactiveAttribute(key, v));
            }
            const gr = this.companion.get("GeometryRegistry") as GeometryRegistry;
            const name = this.getAttribute("name");
            if (!name) {
                throw new Error("Name was not specified");
            }
            gr.addGeometry(name, generator);
            this.geometry = await generator;
        }
    }
}
