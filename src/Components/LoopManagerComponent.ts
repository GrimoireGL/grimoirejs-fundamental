import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import AssetLoader from "../Assets/AssetLoader";
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
        const al: AssetLoader = new AssetLoader();
        al.register(this.wait(1000)).then(result => {
            console.log("first");
        });
        console.log(al.completeCount);
        al.register(this.wait(3000)).then(result => {
            console.log("second");
        });
        al.promise.then(result => {
            console.log("test");
        })
        console.log(al.completeCount);
    }
    private wait(time: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
}

export default LoopManagerComponent;
