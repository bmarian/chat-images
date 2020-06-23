class Utils {
    private readonly _debugging: boolean;
    private readonly _trace: boolean;
    public readonly moduleName: string = 'chat-images';

    constructor(debugging: boolean, trace: boolean) {
        this._debugging = debugging;
        this._trace = trace;

        CONFIG.debug.hooks = debugging;
    }

    private _consoleLog(output: any): void {
        console.log(
            `%cChat Images %c|`,
            'background: #222; color: #bada55',
            'color: #fff',
            output
        );
    }

    private _consoleTrace(output: any): void {
        console.groupCollapsed(
            `%cChat Images %c|`,
            'background: #222; color: #bada55',
            'color: #fff',
            output
        );
        console.trace();
        console.groupEnd();
    }

    public debug(output: any, doTrace?: boolean): void {
        if (this._debugging && output) {
            if (this._trace && doTrace !== false) {
                this._consoleTrace(output);
            } else {
                this._consoleLog(output);
            }
        }
    }
}

export default new Utils(true, true);