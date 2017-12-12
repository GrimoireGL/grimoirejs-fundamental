import Attribute from "grimoirejs/ref/Node/Attribute";
import TextureCube from "../Resource/TextureCube";
import QueryParser from "../Util/QueryParser";

/**
 *
 * @param val
 * @param attr
 */
export default function TextureCubeConverter(val: any, attr: Attribute): any {
    if (val instanceof TextureCube) {
        return val;
    } else if (typeof val === "string") {
        const parseResult = QueryParser.parseFunctionalQuery(val, "erect");
        switch (parseResult[0]) {
            case "erect": // Parse resource as equirectangular

        }
    }
    // TODO implement string case
    return null;
}
