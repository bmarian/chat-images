import {registerSettings, createUploadFolderIfMissing} from "../settings";


class Init {
    private static _instance: Init;

    private constructor() {
    }

    public static getInstance(): Init {
        if (!Init._instance) Init._instance = new Init();
        return Init._instance;
    }

    /**
     * Add a hook on init, to register settings, and to create the Upload folder if it doesn't exist
     */
    public async initHook(): Promise<void> {
        registerSettings();
        await createUploadFolderIfMissing();
    }
}

export default Init.getInstance();