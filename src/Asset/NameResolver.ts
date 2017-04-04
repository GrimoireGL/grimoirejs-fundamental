/**
 * Provide abstraction of resolving named resource such as Geometry, Materials.
 */
export default class NameResolver<T> {

    /**
     * Resolved items
     */
    private _resolved: { [name: string]: T } = {};

    /**
     * Name to Resource-resolvers
     */
    private _resolvers: { [name: string]: Promise<T> } = {};

    /**
     * Name to waiting resolvers
     */
    private _handlers: { [name: string]: ((resolved: T) => void)[] } = {};

    /**
     * Obtain the named resource.
     * @return {Promise<T>} [description]
     */
    public get(name: string): Promise<T> {
        if (this._resolved[name] !== void 0) {
            return Promise.resolve(this._resolved[name]);
        } else {
            return this._waitForResolved(name);
        }
    }

    /**
     * Register named resource
     * @param  {string}     name      name of the resource
     * @param  {Promise<T>} generator Promise to resolve the resource
     * @return {Promise<T>} The promise of resource
     */
    public async register(name: string, generator: Promise<T>): Promise<T> {
        try {
            if (this._resolvers[name] !== void 0) {
              throw new Error(`Dupelicated named resource '${name}' was registered.`);
            }
            this._resolvers[name] = generator;
            const resolved = await generator;
            this._resolvers[name] = void 0;
            this._callHandlers(name, resolved);
            this._resolved[name] = resolved;
            return resolved;
        } catch (e) {
            throw new Error(`Unexpected error has occured during resolution of named resource '${name}'`);
        }
    }

    /**
     * Get promise to wait the named resource registered.
     * @param  {string}     name name of the resource
     * @return {Promise<T>}     Promise to wait for registering
     */
    private _waitForResolved(name: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this._handlers[name] === void 0) {
                this._handlers[name] = [];
            }
            this._handlers[name].push((resolved: T) => {
                resolve(resolved);
            });
        });
    }

    /**
     * Call handler to notify the named resource was loaded.
     * @param {string} name      name of the resource
     * @param {T}      resolved Promise to wait for registering
     */
    private _callHandlers(name: string, resolved: T): void {
        if (this._handlers[name] === void 0) {
            return;
        }
        this._handlers[name].forEach(f => f(resolved));
        delete this._handlers[name];
    }
}
