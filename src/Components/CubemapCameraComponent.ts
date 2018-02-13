import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Vector3 from "grimoirejs-math/ref/Vector3";

import IElementOfCubemapDirection from "../Resource/IElementOfCubemapDirection";
import CameraComponent from "./CameraComponent";
export default class CubemapCameraComponent extends CameraComponent {
    public static componentName = "CubemapCamera";
    public static cubemapDirections: IElementOfCubemapDirection<Quaternion> = {
        PX: Quaternion.angleAxis(Math.PI / 2, Vector3.YUnit),
        NX: Quaternion.angleAxis(-Math.PI / 2, Vector3.YUnit),
        PY: Quaternion.angleAxis(Math.PI / 2, Vector3.XUnit),
        NY: Quaternion.angleAxis(-Math.PI / 2, Vector3.XUnit),
        PZ: Quaternion.angleAxis(0, Vector3.YUnit),
        NZ: Quaternion.angleAxis(-Math.PI, Vector3.YUnit),
    };

    private _cubeTransform: Matrix = Matrix.identity();

    private _direction = "NZ";

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
