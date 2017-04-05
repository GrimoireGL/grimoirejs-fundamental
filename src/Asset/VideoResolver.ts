/**
 * VideoResolver provides abstraction of loading feature for video element.
 * Despite the other resolvers, VideoResolver doesn't extends ExternalResourceResolver since
 * that element contains frame operation also and it affects frame control in each function of grimoire using.
 * @param  {string}                    path [description]
 * @return {Promise<HTMLVideoElement>}      [description]
 */
export class VideoResolver {

    public static defaultCORSConfig = "anonymous";

    /**
     * Cors config resolvers.
     * If all of resolvers returns null, defaultCORSConfig will be used.
     */
    public static corsResolvers: ((path: string) => string)[] = [];

    public resolve(path: string): Promise<HTMLVideoElement> {
        return new Promise<HTMLVideoElement>((resolve, reject) => {
            console.log("load start");
            const video = document.createElement("video");
            video.crossOrigin = this._getCORSConfig(path);
            video.preload = "auto";
            video.addEventListener("canplay", () => {
                resolve(video);
            });
            video.addEventListener("canplaythrough", () => {
                resolve(video);
            });
            video.onerror = (e) => {
                reject(`Error has been occured during loading "${path}"\n${e}`);
            };
            video.src = path;
            video.load();
            if (video.readyState > 3) {
                resolve(video);
            }
        });
    }

    private _getCORSConfig(path: string): string {
        let corsConfig = null;
        for (let i = 0; i < VideoResolver.corsResolvers.length; i++) {
            corsConfig = VideoResolver.corsResolvers[i](path);
            if (corsConfig !== null) {
                break;
            }
        }
        if (corsConfig === null) {
            corsConfig = VideoResolver.defaultCORSConfig;
        }
        return corsConfig;
    }
}

export default new VideoResolver();
