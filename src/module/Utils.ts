class Utils {
    private static _instance: Utils;
    private readonly _debugging: boolean;
    private readonly _trace: boolean;
    public readonly moduleName: string = 'chat-images';
    public readonly moduleTitle: string = 'Chat Images';

    private constructor(debugging: boolean, trace: boolean) {
        this._debugging = debugging;
        this._trace = trace;

        if (debugging) CONFIG.debug.hooks = debugging;
    }

    public static getInstance(debugging: boolean, trace: boolean): Utils {
        if (!Utils._instance) Utils._instance = new Utils(debugging, trace);
        return Utils._instance;
    }

    private _consoleLog(output: any): void {
        console.log(
            `%c${this.moduleTitle} %c|`,
            'background: #222; color: #bada55',
            'color: #fff',
            output
        );
    }

    private _consoleTrace(output: any): void {
        console.groupCollapsed(
            `%c${this.moduleTitle} %c|`,
            'background: #222; color: #bada55',
            'color: #fff',
            output
        );
        console.trace();
        console.groupEnd();
    }

    public debug(output: any, doTrace?: boolean): void {
        if (!this._debugging) return;

        if (this._trace && doTrace !== false) {
            this._consoleTrace(output);
        } else {
            this._consoleLog(output);
        }
    }
}

export default Utils.getInstance(true, true);