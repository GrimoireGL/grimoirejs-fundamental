import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import NSIdentity from "grimoirejs/lib/Core/Base/NSIdentity";

function ChildrenComponentConstraint(componentIds: NSIdentity[]): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return checkRecursive(self, componentIds) ? null : "ChildrenComponentConstraint Error:" + self.nodeName;
  };
}

function checkConstraint(node: GomlNode, componentIds: NSIdentity[]): boolean {
  return componentIds.every((id) => {
    return node.getComponent(id) !== null;
  });
}
function checkRecursive(node: GomlNode, componentIds: NSIdentity[]): boolean {
  if (!checkConstraint(node, componentIds)) {
    return false;
  }
  return node.children.every((child) => {
    return checkRecursive(child, componentIds);
  });
}
export default ChildrenComponentConstraint;
