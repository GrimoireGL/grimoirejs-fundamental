import ExternalResourceResolver from "./ExternalResourceResolver";
export class TextFileResolver extends ExternalResourceResolver<string> {
  public resolve(path: string): Promise<string> {
    return super.resolve(path, (abs) => {
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
}

export default new TextFileResolver();
