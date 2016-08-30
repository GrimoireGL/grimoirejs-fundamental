import CacheResolver from "../Asset/CacheResolver";
export class ImportResolver extends CacheResolver<string> {
  public staticImports: { [key: string]: string } = {};

  constructor() {
    super((str) => {
      const regex = /^https?:\/\/.*/gm;
      return regex.test(str) ? ImportResolver._toAbsolute(str) : str;
    });
  }
  public resolve(path: string): Promise<string> {
    return super.resolve(path, (abs) => {
      return this._resolve(path);
    });
  }

  private async _resolve(path: string): Promise<string> {
    if (this.staticImports[path]) {
      return this.staticImports[path];
    } else {
      return await this._fromExternal(path);
    }
  }

  private _fromExternal(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", path);
      xhr.onload = (v) => {
        resolve(xhr.responseText);
      };
      xhr.onerror = (e) => {
        reject(e);
      };
      xhr.send();
    });
  }

  private static _toAbsolute(href: string): string {
    var link = document.createElement("a");
    link.href = href;
    return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
  }
}

export default new ImportResolver();
