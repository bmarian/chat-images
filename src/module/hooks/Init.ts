import Settings from "../Settings";
import Utils from "../Utils";

class Init {
    private static _instance: Init;

    private constructor() {
    }

    public static getInstance(): Init {
        if (!Init._instance) Init._instance = new Init();
        return Init._instance;
    }

    /**
     * Add a hook on init, to register settings
     */
    public async initHook(): Promise<void> {
        Settings.registerSettings();
        Utils.debug('Finished initialization');
    }
}

export default Init.getInstance();