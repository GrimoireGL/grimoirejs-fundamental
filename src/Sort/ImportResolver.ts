import CacheResolver from "../Asset/CacheResolver";
import DefaultStaticImport from "../Material/Defaults/DefaultStaticImport";
export class ImportResolver extends CacheResolver<string> {

  private static _toAbsolute(href: string): string {
    const link = document.createElement("a");
    link.href = href;
    return `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
  }

  public staticImports: { [key: string]: string } = { ...DefaultStaticImport };

  constructor() {
    super((str) => {
      const regex = /^https?:\/\/.*/gm;
      return regex.test(str) ? ImportResolver._toAbsolute(str) : str;
    });
  }
  public async resolve(path: string): Promise<string> {
    return super.resolve(path, async(abs) => {
      return this._resolve(path);
    });
  }

  private async _resolve(path: string): Promise<string> {
    if (typeof this.staticImports[path] === "string") {
      return this.staticImports[path];
    } else {
      return await this._fromExternal(path);
    }
  }

  private async _fromExternal(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
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
}

export default new ImportResolver();
