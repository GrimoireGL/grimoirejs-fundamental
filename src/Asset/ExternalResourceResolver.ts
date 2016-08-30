import CacheResolver from "./CacheResolver";
export default class ExternalResourceResolver<T> extends CacheResolver<T>{
  constructor() {
    super(ExternalResourceResolver._toAbsolute);
  }

  private static _toAbsolute(href: string): string {
    var link = document.createElement("a");
    link.href = href;
    return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
  }
}
