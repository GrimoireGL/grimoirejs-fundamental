import { Nullable } from "grimoirejs/ref/Tool/Types";

/**
 * Provide abstraction of resolving named resource such as Geometry, Materials.
 */
export default class NameResolver<T> {
    public static UNLOADED = 0;

    public static RESOLVING = 1;

    public static RESOLVED = 2;

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
     * @return {Promise<T>} the resource
     */
    public get(name: string): Promise<T> {
        if (this._resolved[name] !== void 0) {
            return Promise.resolve(this._resolved[name]);
        } else {
            return this._waitForResolved(name);
        }
    }

    /**
     * Obtain reference function which return a object have specified name.
     * Returned object can be changed if specified named object was overwritten by register function.
     * @param name The resource name to fetch
     */
    public getReferenceFunction(name: string): () => Nullable<T> {
        return () => {
            if (this._resolved[name] !== void 0) {
                return this._resolved[name];
            }
            return null;
        };
    }

    /**
     * Get status of specified resource.
     * This method would return NameResolver.UNLOADED,NameResolver.RESOLVED or NameResolver.RESOLVING
     * @param  {string} name resource name to check status
     * @return {number}      status code
     */
    public getStatus(name: string): number {
        if (this._resolvers[name] !== void 0) {
            return NameResolver.RESOLVING;
        } else if (this._resolved[name] !== void 0) {
            return NameResolver.RESOLVED;
        } else {
            return NameResolver.UNLOADED;
        }
    }

    /**
     * Register named resource
     * @param  {string}     name      name of the resource
     * @param  {Promise<T>} generator Promise to resolve the resource
     * @return {Promise<T>} The promise of resource
     */
    public async register(name: string, generator: Promise<T> | T, noDupelicated = false): Promise<T> {
        if (this._isPromise(generator)) {
            try {
                if (this._resolvers[name] !== void 0 && noDupelicated) {
                    throw new Error(`Dupelicated named resource '${name}' was registered.`);
                }
                this._resolvers[name] = generator;
                const resolved = await generator;
                delete this._resolvers[name];
                this._callHandlers(name, resolved);
                this._resolved[name] = resolved;
                return resolved;
            } catch (e) {
                const a = e as Error;
                throw new Error(`Unexpected error has occured during resolution of named resource '${name}'\n${a.message}\n${a.stack}\n\n`);
            }
        } else {
            return this.register(name, Promise.resolve(generator), noDupelicated);
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

    // TODO:(type) Should be migrated to core
    private _isPromise(generator: Promise<T> | T): generator is Promise<T> {
        return (typeof (generator as any)["then"] === "function");
    }
}
