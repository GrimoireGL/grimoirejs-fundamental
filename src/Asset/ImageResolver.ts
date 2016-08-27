import ExternalResourceResolver from "./ExternalResourceResolver";
export default class ImageResolver extends ExternalResourceResolver<HTMLImageElement> {
  public resolve(path: string): Promise<HTMLImageElement> {
    return super.resolve(path, (abs) => {
      return new Promise((resolve, reject) => {
        const imgTag = new Image();
        imgTag.onload = () => {
          resolve(imgTag);
        };
        imgTag.onerror = (e) => {
          reject(e);
        };
        imgTag.src = abs;
      });
    });
  }
}
