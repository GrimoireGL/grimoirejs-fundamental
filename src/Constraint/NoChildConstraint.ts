import gr from "grimoirejs";
const GomlNode = gr.Node.GomlNode;

function NoChildConstraint(): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return self.children.length === 0 ? null : "NoChildConstraint fail:" + self.name;
  };
}
export default NoChildConstraint;
