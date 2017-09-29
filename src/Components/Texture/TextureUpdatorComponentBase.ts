import BasicComponent from "../BasicComponent";
import Texture2D from "../../Resource/Texture2D";
import TextureContainer from "./TextureContainer";


export default class TextureUpdatorComponentBase extends BasicComponent{
    private textureComponent: TextureContainer;
    protected get __texture(): Texture2D{
        return this.textureComponent.texture;
    }

    public $mount(): void{
        this.textureComponent = this.node.getComponent(TextureContainer);
    }
}