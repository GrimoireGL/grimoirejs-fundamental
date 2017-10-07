import GLM from "grimoirejs-math/ref/GLM";
const { vec3, vec4, mat4 } = GLM;
import Matrix from "grimoirejs-math/ref/Matrix";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Component from "grimoirejs/ref/Node/Component";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import RenderQueue from "../SceneRenderer/RenderQueue";
import Timer from "../Util/Timer";
import SceneComponent from "./SceneComponent";
import TransformComponent from "./TransformComponent";
/**
 * シーンを描画するカメラのコンポーネント
 * このコンポーネントによって、透視射影や正方射影などの歪みを調整します。
 * また、このコンポーネントの付属するノードに属する`Transoform`によって、カメラの位置や向きが確定されます。
 */
export default class CameraComponent extends Component {

    public static attributes: { [key: string]: IAttributeDeclaration } = {
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
            converter: "Number",
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
            converter: "Number",
        },
        /**
         * カメラのアスペクト比
         * カメラの横の大きさと縦の大きさの比率を指定します。autoAspect属性がtrueである時、毎回のレンダリング時にこの値を自動調整します。
         */
        aspect: {
            default: 1.6,
            converter: "Number",
        },
        /**
         * アスペクト比の自動調整が有効か否か
         * レンダリング時にそのビューポートの大きさに応じて比率を自動調整するかどうかを示します。
         */
        autoAspect: {
            default: true,
            converter: "Boolean",
        },
        /**
         * 正射影時の横の基準サイズ
         * 正射影時はfovy属性を用いて自動的に写す領域を決定できません。
         * そのため、横の一片のサイズをこの属性で指定します。**アスペクト比は計算に用いられることに注意してください。**
         */
        orthoSize: {
            default: 100,
            converter: "Number",
        },
        /**
         * このカメラが正射影かどうか
         *
         * この属性がfalseである場合、カメラは透視射影としてシーンをレンダリングします。この場合、レンダリング結果にパース(奥行き感)が出ます。
         * 一方、この属性がtrueである場合、カメラは正射影としてシーンをレンダリングします。この場合、レンダリング結果には奥行き感は出ません。
         */
        orthogonal: {
            default: false,
            converter: "Boolean",
        },
    };

    private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
    private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);

    public containedScene: SceneComponent;

    public transform: TransformComponent;

    protected __viewMatrix: Matrix = new Matrix();
    protected __projectionMatrix: Matrix = new Matrix();
    protected __invProjectionMatrix: Matrix = new Matrix();
    protected __projectionViewMatrix: Matrix = new Matrix();

    private _autoAspect: boolean;

    private _aspectCache: number;

    private _renderQueue: RenderQueue = new RenderQueue();

    private _eyeCache: Vector3 = Vector3.Zero;
    private _lookAtCache: Vector3 = Vector3.Zero;
    private _upCache: Vector3 = Vector3.Zero;
    private _far: number;
    private _near: number;
    private _fovy: number;
    private _orthoSize: number;
    private _aspect: number;
    private _orthographic = false;

    public get ViewMatrix (): Matrix {
        return this.__viewMatrix;
    }
    public get ProjectionMatrix (): Matrix {
        return this.__projectionMatrix;
    }
    public get InvProjectionMatrix (): Matrix {
        return this.__invProjectionMatrix;
    }
    public get ProjectionViewMatrix (): Matrix {
        return this.__projectionViewMatrix;
    }
    public get Far (): number {
        return this._far;
    }
    public set Far (far: number) {
        this._far = far;
        this._recalculateProjection();
    }
    public get Near (): number {
        return this._near;
    }
    public set Near (near: number) {
        this._near = near;
        this._recalculateProjection();
    }
    public get Aspect (): number {
        return this._aspect;
    }
    public set Aspect (aspect: number) {
        this._aspect = aspect;
        this._recalculateProjection();
    }
    public get Fovy (): number {
        return this._fovy;
    }

    public set Fovy (fov: number) {
        this._fovy = fov;
        this._recalculateProjection();
    }

    public get OrthoSize (): number {
        return this._orthoSize;
    }

    public set OrthoSize (size: number) {
        this._orthoSize = size;
    }

    public set OrthographicMode (isOrtho: boolean) {
        this._orthographic = isOrtho;
        this._recalculateProjection();
    }

    public get OrthographicMode (): boolean {
        return this._orthographic;
    }

    public set AutoAspect (autoMode: boolean) {
        if (this._autoAspect !== autoMode) {
            this._autoAspect = autoMode;
            this._recalculateProjection();
        }
    }

    public get AutoAspect (): boolean {
        return this._autoAspect;
    }

    /**
   * Find scene tag recursively.
   * @param  {GomlNode}       node [the node to searching currently]
   * @return {SceneComponent}      [the scene component found]
   */
    private static _findContainedScene (node: GomlNode): SceneComponent {
        if (node.parent) {
            const scene = node.parent.getComponent(SceneComponent);
            if (scene) {
                return scene;
            } else {
                return CameraComponent._findContainedScene(node.parent);
            }
        } else {
            return null;
        }
    }

    public $awake (): void {
        this.getAttributeRaw("far").watch((v) => {
            this.Far = v;
        }, true);
        this.getAttributeRaw("near").watch((v) => {
            this.Near = v;
        }, true);
        this.getAttributeRaw("fovy").watch((v) => {
            this.Fovy = v;
        }, true);
        this.getAttributeRaw("aspect").watch((v) => {
            this.Aspect = v;
        }, true);
        this.getAttributeRaw("orthoSize").watch((v) => {
            this.OrthoSize = v;
        }, true);
        this.getAttributeRaw("orthogonal").watch((v) => {
            this.OrthographicMode = v;
        }, true);
        this.getAttributeRaw("autoAspect").boundTo("_autoAspect");
    }

    public $mount (): void {
        this.transform = this.node.getComponent(TransformComponent);
        this.containedScene = CameraComponent._findContainedScene(this.node);
        this.containedScene.queueRegistory.registerQueue(this._renderQueue);
        this.node.on("transformUpdated", this.updateTransform.bind(this));
        this.updateTransform();
    }

    public $unmount (): void {
        this.containedScene.queueRegistory.unregisterQueue(this._renderQueue);
        this.containedScene = null;
    }

    /**
     * Convert global position of transoform to viewport relative position.
     * @param  {TransformComponent} transform The transform to convert position
     * @return {Vector3}                      Viewport relative position
     */
    public getViewportRelativePosition (transform: TransformComponent): Vector3;
    /**
     * Convert specified world position to viewport relative position.
     * @param  {Vector3} worldPos [description]
     * @return {Vector3}          [description]
     */
    public getViewportRelativePosition (worldPos: Vector3): Vector3;
    public getViewportRelativePosition (input: Vector3 | TransformComponent): Vector3 {
        let inputVector;
        if (input instanceof TransformComponent) {
            inputVector = input.globalPosition;
        } else {
            inputVector = input;
        }
        return Matrix.transformPoint(this.ProjectionViewMatrix, inputVector);
    }

    public updateContainedScene (timer: Timer): void {
        if (this.containedScene) {
            this.containedScene.updateScene(timer);
        }
    }

    public renderScene (args: IRenderArgument): void {
        if (this.containedScene) {
            this._justifyAspect(args);
            args.sceneDescription = this.containedScene.sceneDescription;
            this._renderQueue.renderAll(args);
        }
    }

    public updateTransform (): void {
        const transform = this.transform;
        vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
        vec4.transformMat4(this._lookAtCache.rawElements, CameraComponent._frontOrigin.rawElements, transform.globalTransform.rawElements);
        vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
        vec4.transformMat4(this._upCache.rawElements, CameraComponent._upOrigin.rawElements, transform.globalTransform.rawElements);
        mat4.lookAt(this.__viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
        mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
    }

    private _justifyAspect (args: IRenderArgument): void {
        if (this._autoAspect) {
            const asp = args.viewport.Width / args.viewport.Height;
            if (this._aspectCache !== asp) { // Detect changing viewport size
                this.setAttribute("aspect", asp);
                this._aspectCache = asp;
            }
        }
    }

    private _recalculateProjection (): void {
        if (!this._orthographic) {
            mat4.perspective(this.__projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
        } else {
            mat4.ortho(this.__projectionMatrix.rawElements, -this._orthoSize * this._aspect, this._orthoSize * this._aspect, -this._orthoSize, this._orthoSize, this._near, this._far);
        }
        mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
        mat4.invert(this.__invProjectionMatrix.rawElements, this.__projectionMatrix.rawElements);
    }
}
