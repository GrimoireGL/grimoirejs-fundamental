import Texture2D from "../Texture2D";
import RenderBuffer from "../RenderBuffer";
/**
 * Render target contains texture and render buffer
 */
export default class OffscreenRenderTarget{

    public get texture():Texture2D{
        return this.textures[0];
    }

    constructor(public textures:Texture2D[],depthBuffer?:RenderBuffer){
        if(textures.length === 0){
            throw new Error("Textures must contain 1 texture at least");
        }
    }
}