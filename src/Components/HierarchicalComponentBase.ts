import Component from "grimoirejs/ref/Core/Component";
import HierachicalDescription from "../SceneRenderer/HierachicalDescription";

export default class HierarchycalComponentBase extends Component {
    public static componentName = "HierarchycalComponentBase";
    public hierarchicalDescription: HierachicalDescription
        = new HierachicalDescription((node) => {
            if (!node.parent) {
                return null;
            }
            // resolve parent hierarchy description
            const h = node.parent.getComponent(HierarchycalComponentBase);
            if (h) {
                return h.hierarchicalDescription;
            } else {
                return null;
            }
        });

    protected $mount(): void {
        this.hierarchicalDescription.link(this.node);
    }

    protected $unmount(): void {
        this.hierarchicalDescription.unlink();
    }
}
