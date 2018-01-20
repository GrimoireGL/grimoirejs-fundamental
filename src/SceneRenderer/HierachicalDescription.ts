import GomlNode from "grimoirejs/ref/Core/GomlNode";
import { Nullable } from "grimoirejs/ref/Tool/Types";
/**
 * Resolve description of specified parameter considering hierarchy
 */
export default class HierachicalDescription {
    public readonly properties: { [key: string]: any } = {};

    private _parent: Nullable<HierachicalDescription> = null;

    constructor(
        public resolver?: (node: GomlNode) => HierachicalDescription
    ) { }

    public link(node: GomlNode): void {
        if (this.resolver) {
            this._parent = this.resolver(node);
        }
    }

    public unlink(): void {
        this._parent = null;
    }

    public getProperty<T>(key: string): T {
        // TODO: improve performance by caching
        let result = this.properties[key];
        if (!result && this._parent) {
            result = this._parent.getProperty(result);
        }
        return result;
    }

    public setProperty<T>(key: string, value: T): void {
        this.properties[key] = value;
    }
}
