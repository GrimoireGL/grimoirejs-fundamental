import Component from "grimoirejs/ref/Core/Component";
import Scene from "./SceneComponent";
import TextureCube from "../Resource/TextureCube";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";

export default class SkyboxManager extends Component {
    public static componentName = "SkyboxManager";

    public static attributes: { [key: string]: IAttributeDeclaration } = {};

    private _scene: Scene;

    public $mount(): void {
        this._scene = this.node.getComponentInAncestor(Scene);
        this.node.on("material-parameter-updated", () => {
            // TODO: scene property should be updated reactively
            const cube = this.node.getAttribute("src") as TextureCube;
            this._scene.hierarchicalDescription.setProperty("skybox", cube);
        });
    }
}