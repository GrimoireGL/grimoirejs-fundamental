import ExternalResourceResolver from "./ExternalResourceResolver";
export class ImageResolver extends ExternalResourceResolver<HTMLImageElement> {
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

export default new ImageResolver();
