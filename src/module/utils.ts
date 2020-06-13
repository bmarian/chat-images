class Utils {
    private readonly _debugging: boolean = false;
    public readonly debugMode: boolean = false;

    constructor(debugging: boolean) {
        this._debugging = debugging;
        if (CONFIG?.debug?.hooks) {
            CONFIG.debug.hooks = debugging;
        }

        this.debugMode = debugging;
    }

    private _log(output: any): void {
        console.log(`%cChat Images %c|`, 'background: #222; color: #bada55', 'color: #fff', output)
    }

    public debug(output: any): void {
        if (this._debugging && output) {
            this._log(output);
        }
    }
}

export default new Utils(true);