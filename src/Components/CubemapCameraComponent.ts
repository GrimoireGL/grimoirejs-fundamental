import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import IElementOfCubemapDirection from "../Resource/IElementOfCubemapDirection";
import CameraComponent from "./CameraComponent";
export default class CubemapCameraComponent extends CameraComponent {
    public static cubemapDirections: IElementOfCubemapDirection<number[]> = {
        posX: [0, -Math.PI / 2, 0],
        negX: [0, Math.PI / 2, 0],
        posY: [Math.PI / 2, 0, 0],
        negY: [-Math.PI / 2, 0, 0],
        posZ: [0, Math.PI, 0],
        negZ: [0, 0, 0],
    };

    private _cubeTransform: Matrix = Matrix.identity();

    private _direction = "negZ";

    public get direction(): string {
        return this._direction;
    }

    public set direction(direction: string) {
        this._direction = direction;
        this._cubeTransform = Matrix.rotationQuaternion(Quaternion.euler.apply(Quaternion, CubemapCameraComponent.cubemapDirections[direction]));
        this.updateTransform();
    }

    protected __getCameraTransformMatrix(): Matrix {
        return this._cubeTransform.multiplyWith(this.transform.globalTransform);
    }
}
