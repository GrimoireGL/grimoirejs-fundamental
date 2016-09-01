import MaterialComponent from "../Components/MaterialComponent";
function MaterialConverter(val: any): any {
  if (typeof val === "string") {
    const mc = this.tree(val)("Material").get() as MaterialComponent;
    this.component[this.declaration.componentBoundTo] = mc;
    return mc.material;
  }
}

export default MaterialConverter;
