class Utils {
    private readonly _debugging: boolean;
    public readonly debugMode: boolean;
    public readonly moduleName: string = 'chat-images';

    constructor(debugging: boolean) {
        const configDebugHooks = CONFIG?.debug?.hooks;
        this._debugging = configDebugHooks ? configDebugHooks : debugging;

        this.debugMode = debugging;
    }

    private _log(output: any): void {
        console.log(`%cChat Images %c|`, 'background: #222; color: #bada55', 'color: #fff', output);
        console.trace();
    }

    public debug(output: any): void {
        if (this._debugging && output) {
            this._log(output);
        }
    }
}

export default new Utils(true);