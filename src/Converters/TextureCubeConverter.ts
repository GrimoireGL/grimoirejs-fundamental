import { Attribute } from "grimoirejs/ref/Core/Attribute";
import TextureCube from "../Resource/TextureCube";
import QueryParser from "../Util/QueryParser";
import ImageResolver from "../Asset/ImageResolver";
import IElementOfCubemapDirection from "../Resource/IElementOfCubemapDirection";

/**
 *
 * @param val
 * @param attr
 */
export default function TextureCubeConverter(val: any, attr: Attribute): any {
    if (val instanceof TextureCube) {
        return val;
    } else if (typeof val === "string") {
        const cubeTexture = new TextureCube(attr.companion.get("gl"));
        const parseResult = QueryParser.parseFunctionalQuery(val, "erect");
        switch (parseResult[0]) {
            case "cube": // Parse resource as equirectangular
                const resources: IElementOfCubemapDirection<HTMLImageElement> = {} as any;
                const waitFor = [];
                switch (parseResult.length) {
                    case 2:
                        for (let key in TextureCube.imageDirections) {
                            const res = ImageResolver.resolve(parseResult[1].replace("$DIR", key));
                            waitFor.push(res);
                            res.then(i => {
                                resources[key] = i;
                            });
                        }
                        break;
                    case 7:
                        let i = 1;
                        for (let key in TextureCube.imageDirections) {
                            const res = ImageResolver.resolve(parseResult[i].replace("$DIR", key));
                            waitFor.push(res);
                            res.then(img => {
                                resources[key] = img;
                            });
                            i++;
                        }
                        break;
                    default:
                        return null;
                }
                Promise.all(waitFor).then(() => {
                    cubeTexture.updateWithResource(resources);
                });
                break;
            default:
                throw new Error("Unsupported cubemap query");
        }
        return cubeTexture;
    }
    // TODO implement string case
    return null;
}
