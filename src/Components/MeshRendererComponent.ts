import grimoirejs from "grimoirejs";
import GLM from "grimoirejs-math/ref/GLM";
import Component from "grimoirejs/ref/Node/Component";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Geometry from "../Geometry/Geometry";
import IMaterialArgument from "../Material/IMaterialArgument";
import IRenderable from "../SceneRenderer/IRenderable";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import CameraComponent from "./CameraComponent";
import MaterialContainerComponent from "./MaterialContainerComponent";
import SceneComponent from "./SceneComponent";
import TransformComponent from "./TransformComponent";
const { vec3 } = GLM;

/**
 * シーン中に存在するメッシュ一つあたりのレンダリングを司るコンポーネント
 * このメッシュが、対象となるノードの`Transform`や描画に用いる`Camera`、マテリアルなどを考慮して実際のレンダリングを行います。
 */
export default class MeshRenderer extends Component implements IRenderable {

    /**
   * Find scene tag recursively.
   * @param  {GomlNode}       node [the node to searching currently]
   * @return {SceneComponent}      [the scene component found]
   */
    private static _findContainedScene(node: GomlNode): SceneComponent {
        if (node.parent) {
            const scene = node.parent.getComponent(SceneComponent);
            if (scene) {
                return scene;
            } else {
                return MeshRenderer._findContainedScene(node.parent);
            }
        } else {
            return null;
        }
    }

    public static attributes: { [key: string]: IAttributeDeclaration } = {
        /**
         * 描画に用いる形状データ
         */
        geometry: {
            converter: "Geometry",
            default: "quad",
        },
        /**
         * 描画に用いるインデックスバッファ名
         */
        indexGroup: {
            converter: "String",
            default: "default",
        },
        /**
         * このメッシュが属するレイヤー
         *
         * 詳しくは`render-scene`ノードを参考にしてください。
         */
        layer: {
            converter: "String",
            default: "default",
        },
        /**
         * 描画するインデックスの個数
         *
         * デフォルトの状態でジオメトリの全インデックスを描画する
         */
        drawCount: {
            converter: "Number",
            default: Number.MAX_VALUE,
        },
        /**
         * 描画するジオメトリのインデックスのオフセット
         */
        drawOffset: {
            converter: "Number",
            default: 0,
        },
    };

    public index: number;
    public renderArgs: { [key: string]: any } = {};
    public geometry: Promise<Geometry>;
    public geometryInstance: Geometry;
    private indexGroup: string;
    private layer: string;
    private drawOffset: number;
    private drawCount: number;
    private _materialContainer: MaterialContainerComponent;
    private _transformComponent: TransformComponent;
    private _containedScene: SceneComponent;

    private _priortyCalcCache = new Float32Array(3);

    public getRenderingPriorty(camera: CameraComponent, technique: string): number {
        if (!this.geometryInstance || !this._materialContainer.material.techniques[technique]) {
            return Number.NEGATIVE_INFINITY;
        }
        vec3.add(this._priortyCalcCache, camera.transform.globalPosition.rawElements, this.geometryInstance.aabb.Center.rawElements);
        vec3.sub(this._priortyCalcCache, this._priortyCalcCache, this._transformComponent.globalPosition.rawElements);
        return this._materialContainer.getDrawPriorty(vec3.sqrLen(this._priortyCalcCache), technique); // Obtains distance between camera and center of aabb
    }

    protected $awake(): void {
        this.__bindAttributes();
        this.getAttributeRaw("geometry").watch(async () => {
            this.geometryInstance = await this.geometry;
        }, true);
    }

    protected $mount(): void {
        this._transformComponent = this.node.getComponent(TransformComponent);
        this._materialContainer = this.node.getComponent(MaterialContainerComponent);
        this._containedScene = MeshRenderer._findContainedScene(this.node);
        this._containedScene.queueRegistory.addRenderable(this);
    }

    protected $unmount(): void {
        this._containedScene.queueRegistory.removeRenderable(this);
    }

    public render(args: IRenderArgument): void {
        if (!this.node.isActive || !this.enabled || this.layer !== args.layer) {
            return;
        }
        if (!this.geometryInstance || (!args.material && !this._materialContainer.material)) {
            return; // material is not instanciated yet.
        }
        const renderArgs = {
            hierarchicalDescription: this._transformComponent.hierarchicalDescription,
            indexGroup: this.indexGroup,
            geometry: this.geometryInstance,
            camera: args.camera,
            transform: this._transformComponent,
            viewport: args.viewport,
            drawCount: this.drawCount,
            drawOffset: this.drawOffset,
            sceneDescription: args.sceneDescription,
            rendererDescription: args.rendererDescription,
            technique: args.technique,
            renderable: this,
        } as IMaterialArgument;
        if (grimoirejs.debug && window["spector"]) {
            window["spector"].setMarker(`Mesh renderer:${this.node.id}`);
        }
        this._materialContainer.material.draw(renderArgs);
        this.node.emit("render", args);
    }

    public setRenderableIndex(index: number): void {
        this.index = index;
    }
}
