import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

class LoopManagerComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        loopEnabled: {
            defaultValue: false,
            converter: "boolean"
        }
    };

    public awake() {
        this.attributes.get("loopEnabled").addObserver((attr) => {
            console.log("loop was started");
        });
    }
}

export default LoopManagerComponent;
