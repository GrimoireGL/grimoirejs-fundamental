import Attribute from "grimoirejs/lib/Node/Attribute";
import Texture2D from "../Resource/Texture2D";
import ImageResolver from "../Asset/ImageResolver";

function Texture2DConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    const regex = /^query\((.*)\)$/m;
    let regexResult: RegExpExecArray;
    if ((regexResult = regex.exec(val))) {
      const queried = this.tree(regexResult[1]);
    } else {
      const tex = new Texture2D(this.companion.get("gl"));
      ImageResolver.resolve(val).then(t => {
        tex.update(t);
      });
      return tex;
    }
  }
}

export default Texture2DConverter;
