import {localize, MODULE_NAME} from "../CIUtils.js";
import {setSetting} from "./CISettings.js";

export default class CIFirstTimeSetupApp extends FormApplication {
  constructor() {
    super(...arguments);
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: localize('title'),
      template: `modules/${MODULE_NAME}/templates/ci-first-time-setup-app.hbs`,
      classes: [`${MODULE_NAME}-first-time-setup-app`],
      width: 660,
      closeOnSubmit: true,
      submitOnClose: true,
    };
  }

  async getData(options) {
    return {
      moduleName: MODULE_NAME,
      filesUpload: this.getUploadPermissions(),
    };
  }

  getUploadPermissions() {
    const filesUpload = game.settings.get('core', 'permissions')['FILES_UPLOAD'];
    return {
      p: filesUpload.includes(1),
      tp: filesUpload.includes(2),
      agm: filesUpload.includes(3),
      gm: true,
    };
  }
  setUploadPermissions(permissions) {
    const oldPermissions = game.settings.get('core', 'permissions');
    return game.settings.set('core', 'permissions', {
      ...oldPermissions,
      FILES_UPLOAD: permissions,
    });
  }

  async _updateObject(event, formData) {
    const expandedData = expandObject(formData)?.['FILES_UPLOAD'];
    const data = Object.keys(expandedData).reduce((acc, key) => expandedData[key] ? [Number(key), ...acc] : acc, [4]);
    return this.setUploadPermissions(data).then(() => {
      setSetting('showFirstTimeSetup', false);
    });
  }
}
