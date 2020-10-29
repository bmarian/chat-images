import {MODULE_NAME} from "./util";

const ORIGIN_FOLDER = 'data';
const UPLOAD_FOLDER_PATH = 'uploaded-chat-images';
const SETTINGS = [
    {
        key: "warningOnDrop",
        options: {
            name: "Warning on drop",
            hint: "Enables a warning dialog when dropping a file in the chat.",
            type: Boolean,
            default: false,
            config: true,
        },
    },
    {
        key: "warningOnPaste",
        options: {
            name: "Warning on paste",
            hint: "Enables a warning dialog when pasting a file in the chat.",
            type: Boolean,
            default: false,
            config: true,
        },
    },
    {
        key: "whereToSavePastedImages",
        options: {
            name: "Files save location",
            hint: "Do to me not having money to save images on a server you will have to choose where to save them: " +
                `in data\\${UPLOAD_FOLDER_PATH} or chat.db. Some guy told me is better to save them in the data folder ` +
                "¯\\_(ツ)_/¯. This setting applies to copy pasted and drag & dropped files, links don't need to be saved." +
                "WARNING: YOU NEED TO GIVE PLAYERS FILE UPLOAD PERMISSION IF YOU ARE USING THE DATA FOLDER OPTION!!!",
            type: String,
            default: "dataFolder",
            choices: {
                dataFolder: "Data folder",
                database: "Database"
            },
            scope: "world",
            config: true,
            restricted: true,
        },
    },
    {
        key: "saveAsBlobIfCantUpload",
        options: {
            name: "Embed if upload is not possible",
            hint: "If you don't want to give all your players upload permissions this feature will work as before, " +
                "embedding images in chat messages. Keep in mind embedding them is bad for loading times, and world size",
            type: Boolean,
            default: false,
            scope: "world",
            config: true,
            restricted: true,
        },
    },
];

const registerSetting = (setting: any): void => game?.settings?.register(MODULE_NAME, setting.key, setting.options);

const getFolder = (source: string, folder: string): Promise<void> => FilePicker.browse(source, folder);
const createFolder = (source: string, folder: string, options: {}) => FilePicker.createDirectory(source, folder, options);
const createUploadFolder = (location: any): Promise<any> => location.target === '.' && createFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH, {});

// Get the value for a registered setting
const getSetting = (key: string): any => game?.settings?.get(MODULE_NAME, key);

// Register all the settings in the array SETTINGS
const registerSettings = (): void => SETTINGS.forEach(registerSetting);

// Check if the uploaded-chat-images folder exists, if not create it. This check runs every time the module is
// initialized, just in case the user deletes the folder (or black magic happens and the folder disappears)
const createUploadFolderIfMissing = (): Promise<any> => getFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH).then(createUploadFolder);

export {UPLOAD_FOLDER_PATH, getSetting, registerSettings, createUploadFolderIfMissing};