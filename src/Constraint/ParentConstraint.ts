import gr from "grimoirejs";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import NSIdentity from "grimoirejs/ref/Base/NSIdentity";

function ParentConstraint(components: NSIdentity[]): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return components.every((id) => { return self.getComponent(id) != null; })
      ? null : "ParentConstraint Error:" + self.name;
  };
}
export default ParentConstraint;
