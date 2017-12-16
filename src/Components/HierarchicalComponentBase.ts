import Component from "grimoirejs/ref/Node/Component";
import HierachicalDescription from "../SceneRenderer/HierachicalDescription";

export default class HierarchycalComponentBase extends Component {
    public hierarchicalDescription: HierachicalDescription
        = new HierachicalDescription((node) => {
            // resolve parent hierarchy description
            const h = node.getComponent(HierarchycalComponentBase);
            if (h) {
                return h.hierarchicalDescription;
            } else {
                return null;
            }
        });

    public $mount(): void {
        this.hierarchicalDescription.link(this.node);
    }

    public $unmount(): void {
        this.hierarchicalDescription.unlink();
    }
}
