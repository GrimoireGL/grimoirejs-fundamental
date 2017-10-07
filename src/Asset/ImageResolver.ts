import ExternalResourceResolver from "./ExternalResourceResolver";
export class ImageResolver extends ExternalResourceResolver<HTMLImageElement> {

    public static defaultCORSConfig = "anonymous";

    /**
     * Cors config resolvers.
     * If all of resolvers returns null, defaultCORSConfig will be used.
     */
    public static corsResolvers: ((path: string) => string)[] = [];

    public resolve (path: string): Promise<HTMLImageElement> {
        return super.resolve(path, (abs) => {
            return new Promise((resolve, reject) => {
                const imgTag = new Image();
                imgTag.crossOrigin = this._getCORSConfig(abs);
                imgTag.onload = () => {
                    resolve(imgTag);
                };
                imgTag.onerror = (e) => {
                    reject(`Error has been occured during loading "${abs}(${path})"\n${e}`);
                };
                imgTag.src = abs;
            });
        });
    }

    private _getCORSConfig (path: string): string {
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
