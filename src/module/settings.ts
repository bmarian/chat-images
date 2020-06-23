import utils from "./utils";

const settingsList = [
    {
        key: "warningOnDrop",
        settings: {
            name: "Enable warning on drop:",
            hint: "Enables a warning dialog when dropping an image in the chat.",
            type: Boolean,
            default: false,
            scope: "world",
            config: true,
        },
    },
    {
        key: "warningOnPaste",
        settings: {
            name: "Enable warning on paste:",
            hint: "Enables a warning dialog when pasting an image in the chat.",
            type: Boolean,
            default: false,
            scope: "world",
            config: true,
        },
    },
];

export const registerSettings = (): void => {
    settingsList.forEach((setting: any): void => {
        game.settings.register(utils.moduleName, setting.key, setting.settings);
    });
    utils.debug('Settings registered', false);
}
