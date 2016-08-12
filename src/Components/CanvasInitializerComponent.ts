import Component from "grimoirejs/lib/Core/Node/Component";
import ITreeInitializedInfo from "grimoirejs/lib/Core/Node/ITreeInitializedInfo";
class CanvasInitializerComponent extends Component {
    public static attributes = {

    };

    constructor() {
        super();
    }

    public treeInitialized(c: ITreeInitializedInfo): void {
        if (this._isContainedInBody(c.ownerScriptTag)) {
            // canvas should be placed siblings of the script tag
            this._generateCanvas(c.ownerScriptTag.parentElement);
            console.log("in the body");
        } else {
         console.log("not in the body");
        }
    }

    private _generateCanvas(parent: Element): HTMLCanvasElement {
        const generatedCanvas = document.createElement("canvas");
        parent.appendChild(generatedCanvas);
        return generatedCanvas;
    }

    private _isContainedInBody(tag: Element): boolean {
        if (!tag.parentElement) return false;
        if (tag.parentNode.nodeName === "BODY") return true;
        return this._isContainedInBody(tag.parentElement);
    }
}

export default CanvasInitializerComponent;
