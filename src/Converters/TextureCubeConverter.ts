import Attribute from "grimoirejs/ref/Core/Attribute";
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
            case "cube": // Parse resource as equirectangular
                if (parseResult.length === 2) {

                }
        }
    }
    // TODO implement string case
    return null;
}
