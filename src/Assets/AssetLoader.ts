class AssetLoader {
    public registerCount: number = 0;
    public loadCount: number = 0;
    public completeCount: number = 0;
    public errorCount: number = 0;
    public promise: Promise<void> = new Promise<void>((resolve) => { this._resolve = resolve; });
    private _resolve: () => void;
    public register<T>(promise: Promise<T>): Promise<T> {
        this.registerCount++;
        return new Promise<T>((resolve, reject) => {
            (async function() {
                try {
                    resolve(await promise);
                    this.loadCount++;
                } catch (e) {
                    reject(e);
                    this.errorCount++;
                }
                this.completeCount++;
                this._checkLoadCompleted();
            }).bind(this)();
        });
    }
    private _checkLoadCompleted(): void {
        if (this.registerCount === this.completeCount) {
            this._resolve();
        }
    }
}
export default AssetLoader;
