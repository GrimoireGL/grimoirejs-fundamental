import gr from "grimoirejs";
import GomlNode from "grimoirejs/ref/Node/GomlNode";

function RootConstraint(): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    if (self.parent) {
      return "RootConstraint: this node: " + self.name.fqn + " must be tree root.";
    }
    return null;
  };
}
export default RootConstraint;
