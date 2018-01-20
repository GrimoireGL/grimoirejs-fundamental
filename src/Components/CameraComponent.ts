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
import { IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";

const { vec3, vec4, mat4 } = GLM;
/**
 * シーンを描画するカメラのコンポーネント
 * このコンポーネントによって、透視射影や正方射影などの歪みを調整します。
 * また、このコンポーネントの付属するノードに属する`Transoform`によって、カメラの位置や向きが確定されます。
 */
export default class CameraComponent extends Component {
    public static componentName = "Camera";
    public static attributes = {
        /**
         * カメラの視野角。
         * orthogonal属性がtrueである場合この属性は無視されます。
         */
        fovy: {
            default: "45d",
            converter: "Angle2D",
        },
        /**
         * カメラに映るもっとも近い距離です。
         * 0よりも大きく、far属性よりも小さい必要があります。
         */
        near: {
            default: 0.01,
            converter: NumberConverter,
        },
        /**
         * カメラに映る最も遠い距離です。
         * near属性よりも大きい必要があります。
         *
         * far - nearの値があまりにも大きいと、Z-fighting(手前の物体が奥に表示されたように見えたりする)現象が起きる可能性があります。
         * この差があまりに大きい時、カメラに映る物体の座標の小さいz座標の値の差は0に近似されます。
         * 逆にこの値が小さい時は、カメラに映る物体はある程度小さいz座標の差でも問題なく表示されます。
         * **大切なのは、写したい空間よりも無駄に大きくしないこと。常に適切な値を設定するべきです**
         */
        far: {
            default: 100,
            converter: NumberConverter,
        },
        /**
         * カメラのアスペクト比
         * カメラの横の大きさと縦の大きさの比率を指定します。autoAspect属性がtrueである時、毎回のレンダリング時にこの値を自動調整します。
         */
        aspect: {
            default: 1.6,
            converter: NumberConverter,
        },
        /**
         * アスペクト比の自動調整が有効か否か
         * レンダリング時にそのビューポートの大きさに応じて比率を自動調整するかどうかを示します。
         */
        autoAspect: {
            default: true,
            converter: BooleanConverter,
        },
        /**
         * 正射影時の横の基準サイズ
         * 正射影時はfovy属性を用いて自動的に写す領域を決定できません。
         * そのため、横の一片のサイズをこの属性で指定します。**アスペクト比は計算に用いられることに注意してください。**
         */
        orthoSize: {
            default: 100,
            converter: NumberConverter,
        },
        /**
         * このカメラが正射影かどうか
         *
         * この属性がfalseである場合、カメラは透視射影としてシーンをレンダリングします。この場合、レンダリング結果にパース(奥行き感)が出ます。
         * 一方、この属性がtrueである場合、カメラは正射影としてシーンをレンダリングします。この場合、レンダリング結果には奥行き感は出ません。
         */
        orthogonal: {
            default: false,
            converter: BooleanConverter,
        },
    };

    private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
    private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);

    public containedScene: Scene;

    public transform: Transform;
    /**
     * Far clip distance
     */
    public far: number;
    /**
     * Near clip distance
     */
    public near: number;
    /**
     * Fovy angle in radians
     */
    public fovy: number;
    /**
     * Frustom size
     * This property is only used when orthogonal flag is true
     */
    public orthoSize: number;
    /**
     * Aspect ratio
     */
    public aspect: number;
    /**
     * Orthogonal mode or not
     */
    public orthogonal: boolean;

    /**
     * Automatically adjust aspect ratio by viewport
     */
    public autoAspect: boolean;

    public readonly viewMatrix: Matrix = new Matrix();
    public readonly projectionMatrix: Matrix = new Matrix();
    public readonly invProjectionMatrix: Matrix = new Matrix();
    public readonly projectionViewMatrix: Matrix = new Matrix();

    private _aspectCache: number;

    private _renderQueue: RenderQueue = new RenderQueue();

    private _eyeCache: Vector3 = Vector3.Zero;
    private _lookAtCache: Vector3 = Vector3.Zero;
    private _upCache: Vector3 = Vector3.Zero;

    protected $mount(): void {
        this.__bindAttributes();
        this.getAttributeRaw(CameraComponent.attributes.far)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.near)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.fovy)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.aspect)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.orthoSize)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.orthogonal)!.watch(_ => this._recalculateProjection());
        this.getAttributeRaw(CameraComponent.attributes.autoAspect)!.watch(_ => this._recalculateProjection());

        this._recalculateProjection();
        const transform = this.node.getComponent(Transform);
        if (!transform) {
            throw new Error("Transform component is not found.")
        }
        this.transform = transform;
        const containedScene = this.node.getComponentInAncestor(Scene);
        if (!containedScene) {
            throw new Error(`Camera must be contained in a scene.`);
        }
        this.containedScene = containedScene;
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
        vec4.transformMat4(this._lookAtCache.rawElements, CameraComponent._frontOrigin.rawElements, cameraTransform.rawElements);
        vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
        vec4.transformMat4(this._upCache.rawElements, CameraComponent._upOrigin.rawElements, cameraTransform.rawElements);
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
