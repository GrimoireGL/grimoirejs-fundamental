import RenderSceneComponent from "../Components/RenderSceneComponent";
import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Material from "../Material/Material";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
interface RenderSceneArgument {
    renderer:RenderSceneComponent;
    camera: CameraComponent;
    buffers: { [key: string]: Texture2D };
    layer: string;
    viewport: Rectangle;
    loopIndex: number;
    technique: string;
}

export default RenderSceneArgument;
