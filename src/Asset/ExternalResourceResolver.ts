import CacheResolver from "./CacheResolver";
export default class ExternalResourceResolver<T> extends CacheResolver<T> {
  private static _toAbsolute(href: string): string {
    if(href.match(/^blob\:/m)){ // the specified address is blob URL
      return href;
    }
    const link = document.createElement("a");
    link.href = href;
    return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
  }

  constructor() {
    super(ExternalResourceResolver._toAbsolute);
  }
}
