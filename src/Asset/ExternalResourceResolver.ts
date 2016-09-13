import CacheResolver from "./CacheResolver";
export default class ExternalResourceResolver<T> extends CacheResolver<T> {
  private static _toAbsolute(href: string): string {
    const link = document.createElement("a");
    link.href = href;
    return (link.protocol + "//" + link.host + link.pathname + link.search + link.hash);
  }

  constructor() {
    super(ExternalResourceResolver._toAbsolute);
  }
}
