import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import ViewportBaseMouseState from "../../Objects/ViewportBaseMouseState";
import ViewportMouseEvent from "../../Objects/ViewportMouseEvent";
export default class RenderStageBase extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {

    };

    public rendererDescription: { [key: string]: any } = {
        mouse: {
            coords: {
                canvas: [0, 0],
                canvasNormalized: [0, 0],
                viewport: [0, 0],
                viewportNormalized: [0, 0]
            },
            inside: false
        } as ViewportBaseMouseState
    };

    public $mousemove(v: ViewportMouseEvent): void {
        this._assignMouseState(true, v);
    }

    public $mouseenter(v: ViewportMouseEvent): void {
        this._assignMouseState(true, v);
    }

    public $mouseleave(v: ViewportMouseEvent): void {
        this._assignMouseState(false, v);
    }

    private _assignMouseState(inside: boolean, v: ViewportMouseEvent): void {
        const mouseDesc: ViewportBaseMouseState = this.rendererDescription["mouse"];
        mouseDesc.inside = inside;
        mouseDesc.coords["viewport"] = [v.viewportX, v.viewportY];
        mouseDesc.coords["viewportNormalized"] = [v.viewportNormalizedX, v.viewportNormalizedY];
        mouseDesc.coords["canvas"] = [v.canvasX, v.canvasY];
        mouseDesc.coords["canvasNormalized"] = [v.canvasNormalizedX, v.canvasNormalizedY];
    }
}
