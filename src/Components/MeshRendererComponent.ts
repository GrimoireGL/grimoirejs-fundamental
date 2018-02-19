import grimoirejs from "grimoirejs";
import GLM from "grimoirejs-math/ref/GLM";
import Component from "grimoirejs/ref/Core/Component";
import GomlNode from "grimoirejs/ref/Core/GomlNode";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Geometry from "../Geometry/Geometry";
import IMaterialArgument from "../Material/IMaterialArgument";
import IRenderable from "../SceneRenderer/IRenderable";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import CameraComponent from "./CameraComponent";
import MaterialContainer from "./MaterialContainerComponent";
import Scene from "./SceneComponent";
import Transform from "./TransformComponent";
import Vector3 from "grimoirejs-math/ref/Vector3";
import { attribute } from "grimoirejs/ref/Core/Decorator";
const { vec3 } = GLM;

/**
 * シーン中に存在するメッシュ一つあたりのレンダリングを司るコンポーネント
 * このメッシュが、対象となるノードの`Transform`や描画に用いる`Camera`、マテリアルなどを考慮して実際のレンダリングを行います。
 */
export default class MeshRenderer extends Component implements IRenderable {
    public static componentName = "MeshRenderer";

    /**
     * Geometry to be rendered.
     */
    @attribute("Geometry", "quad")
    public geometry!: Geometry;
    /**
     * Indexgroup to be rendered.
     * By default initialization of PRIMITIVE, you can render wireframe by specifying "wireframe".
     */
    @attribute("String", "default")
    private indexGroup!: string;
    /**
     * Layer of 3D scene.
     * This is used for masking during rendering.
     */
    @attribute("String", "default")
    private layer!: string;

    public renderArgs: { [key: string]: any } = {};

    public index!: number;

    private _materialContainer!: MaterialContainer;
    private _transformComponent!: Transform;
    private _containedScene!: Scene;

    private _priortyCalcCache = new Vector3(0, 0, 0);

    public getRenderingPriorty(camera: CameraComponent, technique: string): number {
        if (!this.geometry || this._materialContainer.getAttributeRaw("material").isPending || !this._materialContainer.material.techniques[technique]) {
            return Number.NEGATIVE_INFINITY;
        }
        vec3.add(this._priortyCalcCache.rawElements, camera.transform.globalPosition.rawElements, this.geometry.aabb.Center.rawElements);
        vec3.sub(this._priortyCalcCache.rawElements, this._priortyCalcCache.rawElements, this._transformComponent.globalPosition.rawElements);
        return this._materialContainer.getDrawPriorty(vec3.sqrLen(this._priortyCalcCache.rawElements), technique); // Obtains distance between camera and center of aabb
    }

    protected $mount(): void {
        const transform = this.node.getComponent(Transform);
        const materialContainer = this.node.getComponent(MaterialContainer);
        const scene = this.node.getComponentInAncestor(Scene);
        if (!scene) {
            throw new Error(`Mesh renderer must be inside of a scene`);
        }
        this._transformComponent = transform;
        this._materialContainer = materialContainer;
        this._containedScene = scene;
        this._containedScene.queueRegistry.addRenderable(this);
    }

    protected $unmount(): void {
        this._containedScene.queueRegistry.removeRenderable(this);
    }

    public render(args: IRenderArgument): void {
        if (!this.node.isActive || !this.enabled || this.layer !== args.layer) {
            return;
        }
        if (!this.geometry || this._materialContainer.getAttributeRaw("material").isPending) {
            return; // material is not instanciated yet.
        }
        const renderArgs = {
            hierarchicalDescription: this._transformComponent.hierarchicalDescription,
            indexGroup: this.indexGroup,
            geometry: this.geometry,
            camera: args.camera,
            transform: this._transformComponent,
            viewport: args.viewport,
            sceneDescription: args.sceneDescription,
            rendererDescription: args.rendererDescription,
            technique: args.technique,
            renderable: this,
        } as IMaterialArgument;
        if (grimoirejs.debug && (window as any)["spector"]) {
            (window as any)["spector"].setMarker(`Mesh renderer:${this.node.id}`);
        }
        this._materialContainer.material.draw(renderArgs);
        this.node.emit("render", args);
    }

    public setRenderableIndex(index: number): void {
        this.index = index;
    }
}
