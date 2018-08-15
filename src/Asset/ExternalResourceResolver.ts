import CacheResolver from "./CacheResolver";
export default class ExternalResourceResolver<T> extends CacheResolver<T> {

  /**
   * Check specified url is dataUrl or not
   * @param  {string}  dataUrl [description]
   * @return {boolean}         [description]
   */
  public static isDataURL(dataUrl: string): boolean {
    return !!dataUrl.match(/^\s*data\:.*;base64/);
  }

  /**
   * Make sure that is data URL.
   * @param  {string} href [description]
   * @return {string}      [description]
   */
  private static _toAbsolute(href: string): string {
    if (href.match(/^blob\:/m) || ExternalResourceResolver.isDataURL(href)) { // the specified address is blob URL
      return href;
    }
    const link = document.createElement("a");
    link.href = href;
    return `${link.protocol}//${link.host}${link.pathname}${link.search}${link.hash}`;
  }

  constructor() {
    super(ExternalResourceResolver._toAbsolute);
  }
}
