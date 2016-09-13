import GomlNode from "grimoirejs/lib/Node/GomlNode";
import NSIdentity from "grimoirejs/lib/Base/NSIdentity";

function ParentConstraint(components: NSIdentity[]): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return components.every((id) => { return self.getComponent(id) != null; })
      ? null : "ParentConstraint Error:" + self.nodeName;
  };
}
export default ParentConstraint;
