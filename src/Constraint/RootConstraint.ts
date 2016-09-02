import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";

function RootConstraint(self: GomlNode): string {
    if (self.parent) {
        return "RootConstraint: this node: " + self.nodeName.fqn + " must be tree root.";
    }
    return null;
}

export default RootConstraint;
