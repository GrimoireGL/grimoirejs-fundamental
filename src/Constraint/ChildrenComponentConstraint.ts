import gr from "grimoirejs";
const GomlNode = gr.Node.GomlNode;
const NSIdentity = gr.Base.NSIdentity;

function ChildrenComponentConstraint(componentIds: NSIdentity[]): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return checkRecursive(self, componentIds) ? null : "ChildrenComponentConstraint Error:" + self.name;
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
