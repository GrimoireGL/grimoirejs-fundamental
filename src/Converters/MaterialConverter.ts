import Attribute from "grimoirejs/ref/Node/Attribute";
import MaterialComponent from "../Components/MaterialComponent";
import Material from "../Material/Material";
import MaterialFactory from "../Material/MaterialFactory";

/**
 * マテリアルを指定するためのコンバーター
 * `<material>へのクエリ`が指定された場合は、そのクエリによって検索された先頭の`<material>`を用いる。
 * `new(マテリアル名)`が指定された場合は、新しいマテリアルのインスタンスを生成して用いる。
 * 通常、マテリアルを指定するコンポーネントはマテリアルによって、そのコンポーネントが所持する属性が置き換わる。
 * `new(マテリアル)`名で指定した場合、そのコンポーネント自身がマテリアルの属性を管理することになるので注意が必要。
 */
export default function MaterialConverter (val: any, attr: Attribute): any {
  if (typeof val === "string") {
    const regex = /\s*new\s*\(\s*([a-zA-Z\d\-]+)\s*\)/;
    let regexResult: RegExpExecArray |null;
    if (regexResult = regex.exec(val)) { // new material should be instanciated for this material
      (attr.component as any)[attr.declaration["componentBoundTo"]] = null;
      return MaterialFactory.get(attr.companion.get("gl")).instanciate(regexResult[1]);
    } else {
      const node = attr.tree(val).first();
      if (node) {
        const mc = node.getComponent(MaterialComponent);
        (attr.component as any)[attr.declaration["componentBoundTo"]] = mc;
        return mc.materialPromise;
      } else {
        console.warn(`There was no matching material component filtered by '${val}'`);
        return null;
      }
    }
  } else if (val instanceof Material) {
    (attr.component as any)[attr.declaration["componentBoundTo"]] = null;
    return Promise.resolve(val);
  }
  return null; // TODO ??
}
