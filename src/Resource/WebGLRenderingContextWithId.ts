export default interface WebGLRenderingContextWithId extends WebGLRenderingContext{
    /**
     * Context ID that Grimoire.js will apply on initialization timing
     */
    __id__: string;
}
