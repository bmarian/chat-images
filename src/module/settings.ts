import {localize, MODULE_NAME} from "./util";

const ORIGIN_FOLDER = 'data';
const UPLOAD_FOLDER_PATH = 'uploaded-chat-images';

const registerSetting = (setting: any): void => game?.settings?.register(MODULE_NAME, setting.key, setting.options);

const getFolder = (source: string, folder: string): Promise<void> => FilePicker.browse(source, folder);
const createFolder = (source: string, folder: string, options: {}) => FilePicker.createDirectory(source, folder, options);
const createUploadFolder = (location: any): Promise<any> => location.target === '.' && createFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH, {});

// Get the value for a registered setting
const getSetting = (key: string): any => game?.settings?.get(MODULE_NAME, key);

// Register all the settings in the array SETTINGS
const registerSettings = (): void => {
    const SETTINGS = [
        {
            key: "warningOnDrop",
            options: {
                name: localize('settings.warningOnDrop.name'),
                hint: localize('settings.warningOnDrop.hint'),
                type: Boolean,
                default: false,
                config: true,
            },
        },
        {
            key: "warningOnPaste",
            options: {
                name: localize('settings.warningOnPaste.name'),
                hint: localize('settings.warningOnPaste.hint'),
                type: Boolean,
                default: false,
                config: true,
            },
        },
        {
            key: "uploadCompression",
            options: {
                name: localize('settings.uploadCompression.name'),
                hint: localize('settings.uploadCompression.hint'),
                type: Number,
                default: 1,
                range: {
                    min: 0.1,
                    step: 0.1,
                    max: 1,
                },
                scope: "world",
                config: true,
                restricted: true,
            }
        },
        {
            key: "embeddedCompression",
            options: {
                name: localize('settings.embeddedCompression.name'),
                hint: localize('settings.embeddedCompression.hint'),
                type: Number,
                default: 0.6,
                range: {
                    min: 0.1,
                    step: 0.1,
                    max: 1,
                },
                scope: "world",
                config: true,
                restricted: true,
            }
        },
        {
            key: "whereToSavePastedImages",
            options: {
                name: localize('settings.whereToSavePastedImages.name'),
                hint: localize('settings.whereToSavePastedImages.hint'),
                type: String,
                default: "dataFolder",
                choices: {
                    dataFolder: localize('settings.whereToSavePastedImages.choices.dataFolder'),
                    database: localize('settings.whereToSavePastedImages.choices.database')
                },
                scope: "world",
                config: true,
                restricted: true,
            },
        },
        {
            key: "saveAsBlobIfCantUpload",
            options: {
                name: localize('settings.saveAsBlobIfCantUpload.name'),
                hint: localize('settings.saveAsBlobIfCantUpload.hint'),
                type: Boolean,
                default: false,
                scope: "world",
                config: true,
                restricted: true,
            },
        },
    ];

    SETTINGS.forEach(registerSetting);
}

// Check if the uploaded-chat-images folder exists, if not create it. This check runs every time the module is
// initialized, just in case the user deletes the folder (or black magic happens and the folder disappears)
const createUploadFolderIfMissing = (): Promise<any> => getFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH).then(createUploadFolder);

export {UPLOAD_FOLDER_PATH, getSetting, registerSettings, createUploadFolderIfMissing};