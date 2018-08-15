import ExternalResourceResolver from "./ExternalResourceResolver";
export class ImageResolver extends ExternalResourceResolver<HTMLImageElement> {


    public static defaultCORSConfig = "anonymous";

    /**
     * Cors config resolvers.
     * If all of resolvers returns null, defaultCORSConfig will be used.
     */
    public static corsResolvers: ((path: string) => string)[] = [];

    /**
     * Wait for specified ImageElement loaded.
     */
    public async waitForImageLoaded(image: HTMLImageElement): Promise<HTMLImageElement> {
        if (image.complete && image.naturalWidth) { // When image is loaded already
            return image;
        } else {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                image.onload = (a: Event) => {
                    resolve(image);
                };
                image.onerror = (e) => {
                    reject(e);
                };
            });
        }
    }

    public resolve(path: string): Promise<HTMLImageElement> {
        return super.resolve(path, (abs) => {
            const imgTag = new Image();
            imgTag.crossOrigin = this._getCORSConfig(abs);
            imgTag.src = abs;
            return this.waitForImageLoaded(imgTag);
        });
    }

    private _getCORSConfig(path: string): string {
        let corsConfig = null;
        for (let i = 0; i < ImageResolver.corsResolvers.length; i++) {
            corsConfig = ImageResolver.corsResolvers[i](path);
            if (corsConfig !== null) {
                break;
            }
        }
        if (corsConfig === null) {
            corsConfig = ImageResolver.defaultCORSConfig;
        }
        return corsConfig;
    }
}

export default new ImageResolver();
