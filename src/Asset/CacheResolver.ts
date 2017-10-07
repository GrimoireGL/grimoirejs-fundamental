/**
 * Resolve resources with caching.
 */
export default class CacheResolver<T> {
  public cache: { [key: string]: T } = {};

  public resolvers: { [key: string]: Promise<T> } = {};

  constructor (public toAbsolute: (relative: string) => string) {

  }

  public async resolve (src: string, resolver: (abs: string) => Promise<T>): Promise<T> {
    const abs = this.toAbsolute(src);
    if (this._cached(abs)) {
      return this.cache[abs];
    } else if (this._resolving(abs)) {
      return await this.resolvers[abs];
    } else {
      this.resolvers[abs] = resolver(abs);
      const result = await this.resolvers[abs];
      this._resolved(abs, result);
      return result;
    }
  }

  private _cached (abs: string): boolean {
    return typeof this.cache[abs] !== "undefined";
  }

  private _resolving (abs: string): boolean {
    return typeof this.resolvers[abs] !== "undefined";
  }

  private _resolved (abs: string, result: T): void {
    delete this.resolvers[abs];
    this.cache[abs] = result;
  }
}
