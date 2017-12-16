import GrimoireJS from "grimoirejs";
import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
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
                viewportNormalized: [0, 0],
            },
            left: false,
            right: false,
            inside: false,
        } as ViewportBaseMouseState,
    };

    public metadata: { [key: string]: any } = {};

    protected $mousemove(v: ViewportMouseEvent): void {
        this._assignMouseState(v);
    }

    protected $mouseenter(v: ViewportMouseEvent): void {
        this._assignMouseState(v);
    }

    protected $mouseleave(v: ViewportMouseEvent): void {
        this._assignMouseState(v);
    }

    protected $mousedown(v: ViewportMouseEvent): void {
        this._assignMouseState(v);
    }

    protected $mouseup(v: ViewportMouseEvent): void {
        this._assignMouseState(v);
    }

    protected $click(v: ViewportMouseEvent): void {
        return;
    }

    protected $dblclick(v: ViewportMouseEvent): void {
        return;
    }

    protected __beforeRender(): boolean {
        if (GrimoireJS.debug && !!window["spector"]) {
            let metas = "";
            for (const key in this.metadata) {
                if (this.metadata[key] === undefined) {
                    continue;
                }
                metas += `${key}=${this.metadata[key]}|`;
            }
            window["spector"].setMarker(`Renderer|${metas}`);
        }
        return true;
    }

    private _assignMouseState(v: ViewportMouseEvent): void {
        const mouseDesc: ViewportBaseMouseState = this.rendererDescription["mouse"];
        mouseDesc.inside = v.inside;
        mouseDesc.coords["viewport"] = [v.viewportX, v.viewportY];
        mouseDesc.coords["viewportNormalized"] = [v.viewportNormalizedX, v.viewportNormalizedY];
        mouseDesc.coords["canvas"] = [v.canvasX, v.canvasY];
        mouseDesc.coords["canvasNormalized"] = [v.canvasNormalizedX, v.canvasNormalizedY];
        mouseDesc.left = this._isLeftButtonPressed(v);
        mouseDesc.right = this._isRightButtonPressed(v);
    }

    private _isLeftButtonPressed(v: ViewportMouseEvent): boolean {
        return v.buttons === 1 || (v.buttons === void 0 && v.which === 1);
    }

    private _isRightButtonPressed(v: ViewportMouseEvent): boolean {
        return v.buttons === 2 || (v.buttons === void 0 && v.which === 3);
    }
}
