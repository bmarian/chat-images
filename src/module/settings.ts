import utils from "./utils";

const settingsList = [

];

export const registerSettings = function() {
    settingsList.forEach((setting) => {
        game.settings.register(utils.moduleName, setting.key, setting.settings);
    });
}
