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

    private async _createChatImageFolder(target, folderPath) {
        let source = 'data';
        let base = await FilePicker.browse(source, folderPath);
        if (base.target === target) {
            await FilePicker.createDirectory(source, folderPath, {});
        }
    }

    /**
     * Add a hook on init, to register settings
     */
    public async initHook(): Promise<void> {
        Settings.registerSettings();
        this._createChatImageFolder('.', 'UploadedChatImages').then(() => {
            Utils.debug('Finished initialization');
        });
    }
}

export default Init.getInstance();