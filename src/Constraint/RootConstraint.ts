import GomlNode from "grimoirejs/lib/Node/GomlNode";

function RootConstraint(): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    if (self.parent) {
      return "RootConstraint: this node: " + self.nodeName.fqn + " must be tree root.";
    }
    return null;
  };
}
export default RootConstraint;
