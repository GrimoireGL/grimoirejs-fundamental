import ExternalResourceResolver from "./ExternalResourceResolver";
export class TextFileResolver extends ExternalResourceResolver<string> {

  public resolve(path: string): Promise<string> {
    return super.resolve(path, (abs) => {
      if (TextFileResolver.isDataURL(abs)) {
        return Promise.resolve(this._dataUriToText(abs));
      }
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", abs);
        xhr.onload = (v) => {
          resolve(xhr.responseText);
        };
        xhr.onerror = (e) => {
          reject(e);
        };
        xhr.send();
      });
    });
  }

  private _dataUriToText(dataUrl: string): string {
    const splittedUri = dataUrl.split(",");
    const byteString = atob(splittedUri[1]);
    return byteString;
}
}

export default new TextFileResolver();
