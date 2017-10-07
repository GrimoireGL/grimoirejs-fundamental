interface IGLInstancedArrayInterface {
    vertexAttribDivisorANGLE (index: number, divisor: number): void;
    drawElementsInstancedANGLE (mode: number, count: number, type: number, offset: number, primitiveCount: number): void;
}

export default IGLInstancedArrayInterface;
