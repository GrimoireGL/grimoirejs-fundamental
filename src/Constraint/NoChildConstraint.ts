import gr from "grimoirejs";
import GomlNode from "grimoirejs/ref/Node/GomlNode";

function NoChildConstraint(): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return self.children.length === 0 ? null : "NoChildConstraint fail:" + self.name;
  };
}
export default NoChildConstraint;
