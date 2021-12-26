'use strict';

import {localize, log, MODULE_NAME} from "./utils.js";

// the path of the foundry data folder
const ORIGIN_FOLDER = 'data',
    // the path of the folder where all the uploaded images are saved
    UPLOAD_FOLDER_PATH = `uploaded-${MODULE_NAME}`;

/**
 * Browse files for a certain directory location
 *
 * @param {string} source - The source location in which to browse. See FilePicker#sources for details
 * @param {string} target - The target within the source location
 *
 * @return {Promise<Object>} A Promise which resolves to the directories and files contained in the location
 */
function getFolder(source, target) {
    return FilePicker.browse(source, target)
}

/**
 * Create a subdirectory within a given source. The requested subdirectory path must not already exist.
 *
 * @param {string} source - The source location in which to browse
 * @param {string} target - The target within the source location
 * @param {Object} [options={}] - Optional arguments which modify the request
 *
 * @return {Promise<Object>}
 */
function createFolder(source, target, options = {}) {
    return FilePicker.createDirectory(source, target, options);
}

/**
 * Check if the uploaded-chat-images folder exists, if not create it. This check runs every time the module is
 * initialized, just in case the user deletes the folder (or black magic happens and the folder disappears)
 *
 * @return {Promise<Object>}
 */
function createUploadFolderIfMissing() {
    return getFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH)
        .then(location => location.target === '.' && createFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH))
        .catch(() => createFolder(ORIGIN_FOLDER, UPLOAD_FOLDER_PATH));
}

/**
 * The function returns the value for a register setting
 *
 * @param {string} key - the name of the setting
 *
 * @return {*}
 */
function getSetting(key) {
    return game.settings.get(MODULE_NAME, key);
}

/**
 * The function calls the foundry register setting function with the module name
 *
 * @param {Object} setting
 * @param {string} setting.key - the name of the setting
 * @param {Object} setting.options - the properties of the setting
 */
function registerSetting(setting) {
    return game.settings.register(MODULE_NAME, setting.key, setting.options);
}

/**
 * Register all the module's settings
 */
function registerSettings() {
    // a list of all the module's settings
    // initialized here to be able to localize the strings
    const settings = [
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
            key: "embeddedCompression",
            options: {
                name: localize('settings.embeddedCompression.name'),
                hint: localize('settings.embeddedCompression.hint'),
                type: Number,
                default: 0.6,
                range: {
                    min: 0.1,
                    step: 0.1,
                    max: 0.6,
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

    settings.forEach(registerSetting);
}

export {
    ORIGIN_FOLDER,
    UPLOAD_FOLDER_PATH,
    getSetting,
    registerSettings,
    createUploadFolderIfMissing
};
