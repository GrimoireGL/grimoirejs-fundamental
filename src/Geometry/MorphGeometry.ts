import Geometry from "./Geometry";
import MorphParameter from "./MorphParameter";

/**
 * Geometries with morphing features
 */
export default class MorphGeometry extends Geometry {

    private _morphBaseAttribute: { [semantics: string]: MorphParameter } = {};

    public morphParameters: { [semantics: string]: MorphParameter[] } = {};

    public lastWeights: number[] = null;

    public addMorphAttribute (semantics: string, morphParameters: MorphParameter[]): void {
        const accessor = this.accessors[semantics];
        if (!accessor) {
            throw new Error("There was no accessor related to specified accessor");
        }
        const buffer = this.buffers[accessor.bufferIndex];
        if (!buffer.keepSource) {
            throw new Error("To enable morphing attribute on Geometry, keepOnBuffer flag must be true on attribute vertex value");
        }
        if (this._morphBaseAttribute[semantics]) {
            throw new Error("Already morphing attribute are registered. If you want to replace, remove current morphings at first.");
        }
        if (this.lastWeights === null) {
            // Initialize weights
            const initialWeights = [];
            for (let i = 0; i < morphParameters.length; i++) {
                initialWeights.push(0);
            }
            this.lastWeights = initialWeights;
        } else if (this.lastWeights.length !== morphParameters.length) {
            throw new Error("morphing attribute should have same length with the morphing attribute previously registered.");
        }
        const baseBuffer = buffer.bufferSource;
        if (!(baseBuffer instanceof Float32Array)) {
            throw new Error("Morphing is currently only supported for Float32Array");
        }
        const length = baseBuffer.byteLength / baseBuffer.BYTES_PER_ELEMENT;
        // Copy base source
        const copiedBaseBuffer = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            copiedBaseBuffer[i] = baseBuffer[i];
        }
        this._morphBaseAttribute[semantics] = {
            buffer: copiedBaseBuffer,
            accessor: this.accessors[semantics],
        };
        this.morphParameters[semantics] = morphParameters;
    }

    public removeMorphAttribute (semantics: string): void{
        delete this.morphParameters[semantics];
        delete this._morphBaseAttribute[semantics];
        if (Object.keys(this.morphParameters).length === 0){
            this.lastWeights = null;
        }
    }

    public setWeight (weights: number[]): void{
        this.lastWeights = weights;
        for (const key in this._morphBaseAttribute){
            this._updateForSemantics(key);
        }
    }

    private _updateForSemantics (semantics: string): void{
        const accessor = this.accessors[semantics];
        const target = this.buffers[accessor.bufferIndex];
        const targetBuffer = target.bufferSource;
        if (!(targetBuffer instanceof Float32Array)){
            throw new Error("buffer source must be Float32Array");
        }
        for (let i = 0; i < targetBuffer.length; i++){
            targetBuffer[i] = this._calculateWeights(semantics, i);
        }
        target.update(targetBuffer);
    }

    private _calculateWeights (semantics: string, index: number): number{
        let result = this._morphBaseAttribute[semantics].buffer[index];
        for (let i = 0 ; i < this.lastWeights.length; i++){
            result += this.lastWeights[i] * this.morphParameters[semantics][i].buffer[index];
        }
        return result;
    }
}
