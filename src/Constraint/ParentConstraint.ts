import gr from "grimoirejs";
const GomlNode = gr.Node.GomlNode;
const NSIdentity = gr.Base.NSIdentity;

function ParentConstraint(components: NSIdentity[]): ((self: GomlNode) => string) {
  return (self: GomlNode) => {
    return components.every((id) => { return self.getComponent(id) != null; })
      ? null : "ParentConstraint Error:" + self.name;
  };
}
export default ParentConstraint;
