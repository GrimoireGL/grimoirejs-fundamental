import Material from "./Material";

export default interface IMaterialResolutionResult {
    material: Material;
    external: boolean;
}

export async function createMaterialResolutionResult(material: Promise<Material>, external: boolean): Promise<IMaterialResolutionResult> {
    const resolvedMaterial = await material;
    return {
        material: resolvedMaterial,
        external
    };
}