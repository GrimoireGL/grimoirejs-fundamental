import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";

function NoChildConstraint(): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return self.children.length === 0 ? null : "NoChildConstraint fail:" + self.nodeName;
  };
}
export default NoChildConstraint;
