import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Vector3 from "grimoirejs-math/ref/Vector3";

import IElementOfCubemapDirection from "../Resource/IElementOfCubemapDirection";
import CameraComponent from "./CameraComponent";
export default class CubemapCameraComponent extends CameraComponent {
    public static componentName = "CubemapCameraComponent";
    public static cubemapDirections: IElementOfCubemapDirection<Quaternion> = {
        posX: Quaternion.angleAxis(Math.PI / 2, Vector3.YUnit),
        negX: Quaternion.angleAxis(-Math.PI / 2, Vector3.YUnit),
        posY: Quaternion.angleAxis(Math.PI / 2, Vector3.XUnit),
        negY: Quaternion.angleAxis(-Math.PI / 2, Vector3.XUnit),
        posZ: Quaternion.angleAxis(0, Vector3.YUnit),
        negZ: Quaternion.angleAxis(-Math.PI, Vector3.YUnit),
    };

    private _cubeTransform: Matrix = Matrix.identity();

    private _direction = "negZ";

    public get direction(): string {
        return this._direction;
    }

    public set direction(direction: string) {
        this._direction = direction;
        this._cubeTransform = Matrix.rotationQuaternion(CubemapCameraComponent.cubemapDirections[direction]).multiplyWith(Matrix.scale(new Vector3(1, -1, 1)));
        this.updateTransform();
    }

    protected __getCameraTransformMatrix(): Matrix {
        return this.transform.globalTransform.multiplyWith(this._cubeTransform);
    }
}
