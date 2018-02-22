import GLM from 'grimoirejs-math/ref/GLM';
import Matrix from 'grimoirejs-math/ref/Matrix';
import Vector3 from 'grimoirejs-math/ref/Vector3';
import Vector4 from 'grimoirejs-math/ref/Vector4';
import { BooleanConverter } from 'grimoirejs/ref/Converter/BooleanConverter';
import { NumberConverter } from 'grimoirejs/ref/Converter/NumberConverter';
import Component from 'grimoirejs/ref/Core/Component';
import { Nullable } from 'grimoirejs/ref/Tool/Types';

import IRenderArgument from '../SceneRenderer/IRenderArgument';
import RenderQueue from '../SceneRenderer/RenderQueue';
import Timer from '../Util/Timer';
import Scene from './SceneComponent';
import Transform from './TransformComponent';
import Identity from "grimoirejs/ref/Core/Identity"
import { IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import { attribute, watch, component, componentInAncestor } from 'grimoirejs/ref/Core/Decorator';

const { vec3, vec4, mat4 } = GLM;
/**
 * シーンを描画するカメラのコンポーネント
 * このコンポーネントによって、透視射影や正方射影などの歪みを調整します。
 * また、このコンポーネントの付属するノードに属する`Transoform`によって、カメラの位置や向きが確定されます。
 */
export default class CameraComponent extends Component {
    public static componentName = "Camera";
    private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
    private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0)
    /**
     * Far clip distance
     */
    @attribute(NumberConverter, 100)
    public far!: number;
    /**
     * Near clip distance
     */
    @attribute(NumberConverter, 0.01)
    public near!: number;
    /**
     * Fovy angle in radians
     */
    @attribute("Angle2D", "45d")
    public fovy!: number;
    /**
     * Frustom size
     * This property is only used when orthogonal flag is true
     */
    @attribute(NumberConverter, 100)
    public orthoSize!: number;
    /**
     * Aspect ratio
     */
    @attribute(NumberConverter, 1.6)
    public aspect!: number;
    /**
     * Orthogonal mode or not
     */
    @attribute(BooleanConverter, false)
    public orthogonal!: boolean;

    /**
     * Automatically adjust aspect ratio by viewport
     */
    @attribute(BooleanConverter, true)
    public autoAspect!: boolean;

    /**
     * Contained scene of this camera.
     */
    @componentInAncestor(Scene)
    public containedScene!: Scene;
    /**
     * Transform component of this node
     */
    @component(Transform)
    public transform!: Transform;

    public readonly viewMatrix: Matrix = new Matrix();
    public readonly projectionMatrix: Matrix = new Matrix();
    public readonly invProjectionMatrix: Matrix = new Matrix();
    public readonly projectionViewMatrix: Matrix = new Matrix();

    private _aspectCache!: number;

    private _renderQueue: RenderQueue = new RenderQueue();

    private _eyeCache: Vector3 = Vector3.Zero;
    private _lookAtCache: Vector3 = Vector3.Zero;
    private _upCache: Vector3 = Vector3.Zero;

    protected $mount(): void {
        this._recalculateProjection();
        this.containedScene.queueRegistry.registerQueue(this._renderQueue);
        this.node.on("transformUpdated", this.updateTransform.bind(this));
        this.updateTransform();
    }

    protected $unmount(): void {
        this.containedScene!.queueRegistry.unregisterQueue(this._renderQueue);
        delete this.containedScene
    }

    /**
     * Convert global position of transoform to viewport relative position.
     * @param  {Transform} transform The transform to convert position
     * @return {Vector3}                      Viewport relative position
     */
    public getViewportRelativePosition(transform: Transform): Vector3;
    /**
     * Convert specified world position to viewport relative position.
     * @param  {Vector3} worldPos [description]
     * @return {Vector3}          [description]
     */
    public getViewportRelativePosition(worldPos: Vector3): Vector3;
    public getViewportRelativePosition(input: Vector3 | Transform): Vector3 {
        let inputVector;
        if (input instanceof Transform) {
            inputVector = input.globalPosition;
        } else {
            inputVector = input;
        }
        return Matrix.transformPoint(this.projectionViewMatrix, inputVector);
    }

    public updateContainedScene(timer: Timer): void {
        if (this.containedScene) {
            this.containedScene.updateScene(timer);
        }
    }

    public renderScene(args: IRenderArgument): void {
        if (this.containedScene) {
            this._justifyAspect(args);
            args.sceneDescription = this.containedScene.sceneDescription;
            this._renderQueue.renderAll(args);
        }
    }

    public updateTransform(): void {
        const cameraTransform = this.__getCameraTransformMatrix();
        vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, cameraTransform.rawElements);
        vec4.transformMat4(this._lookAtCache.rawElements as any, CameraComponent._frontOrigin.rawElements, cameraTransform.rawElements);
        vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
        vec4.transformMat4(this._upCache.rawElements as any, CameraComponent._upOrigin.rawElements, cameraTransform.rawElements);
        mat4.lookAt(this.viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
        mat4.mul(this.projectionViewMatrix.rawElements, this.projectionMatrix.rawElements, this.viewMatrix.rawElements);
    }

    protected __getCameraTransformMatrix(): Matrix {
        return this.transform.globalTransform;
    }

    private _justifyAspect(args: IRenderArgument): void {
        if (this.autoAspect) {
            const asp = args.viewport.Width / args.viewport.Height;
            if (this._aspectCache !== asp) { // Detect changing viewport size
                this.setAttribute("aspect", asp);
                this._aspectCache = asp;
            }
        }
    }

    @watch("far")
    @watch("near")
    @watch("fovy")
    @watch("aspect")
    @watch("orthoSize")
    @watch("orthogonal")
    @watch("autoAspect")
    private _recalculateProjection(): void {
        if (!this.orthogonal) {
            mat4.perspective(this.projectionMatrix.rawElements, this.fovy, this.aspect, this.near, this.far);
        } else {
            mat4.ortho(this.projectionMatrix.rawElements, -this.orthoSize * this.aspect, this.orthoSize * this.aspect, -this.orthoSize, this.orthoSize, this.near, this.far);
        }
        mat4.mul(this.projectionViewMatrix.rawElements, this.projectionMatrix.rawElements, this.viewMatrix.rawElements);
        mat4.invert(this.invProjectionMatrix.rawElements, this.projectionMatrix.rawElements);
    }
}
