'use strict';

const MODULE_TITLE = 'Chat Images';
const MODULE_NAME = 'chat-images';
// determines if we should display debug
const DEBUGGING = true;
// Determines if the debug should have a trace history
const TRACE = true;
// A colored titled displayed before every console message
const CONSOLE_MESSAGE_PRESET = [`%c${MODULE_TITLE} (㇏(•̀ᵥᵥ•́)ノ) %c|`, 'background: #222; color: #bada55', 'color: #fff'];

/**
 * A custom function that will display display the trace history, and a styled message in
 * the console (Title + color)
 *
 * @param {*} output - the output to be displayed in the console
 */
const consoleTrace = (...output) => {
  console.groupCollapsed(...CONSOLE_MESSAGE_PRESET, ...output);
  console.trace();
  console.groupEnd();
}

/**
 * A custom function that calls console.log and adds the module styling (Title + color)
 *
 * @param {*} output - the output to be displayed in the console
 */
const consoleLog = (...output) => console.log(...CONSOLE_MESSAGE_PRESET, ...output);

/**
 * A custom logging function, depending on two constants it should output some amount of
 * debugging data in the console:
 *
 * DEBUGGING: false - no debug
 * TRACE: true - will also show the trace history
 *
 * @param {*} output - the output to be displayed in the console
 */
const log = (...output) => {
  if (!DEBUGGING) return;
  return TRACE ? consoleTrace(...output) : consoleLog(...output);
}

/**
 * Custom wrapper for localization, it adds the module name in front of the string
 * and returns the localize string
 *
 * @param {string} path
 *
 * @return {string}
 */
const localize = (path) => game.i18n.localize(`${MODULE_NAME}.${path}`);

/**
 * Generates a random string with 30 characters
 *
 * @return {string}
 */
const randomString = () => Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);

/**
 * Determines if the current user can upload files
 *
 * @return {boolean}
 */
const getUploadPermissionStatus = () => game?.permissions?.FILES_UPLOAD?.includes(game?.user?.role);

/**
 * Returns the foundry version
 *
 * @return {number | string | undefined}
 */
const getFoundryVersion = () => game?.data?.version;

/**
 * Returns if the foundry version is 0.8.x
 *
 * @return {boolean}
 */
const isFoundry8 = () => getFoundryVersion() >= '0.8.0';

export {
  MODULE_TITLE,
  MODULE_NAME,
  log,
  localize,
  randomString,
  getUploadPermissionStatus,
  getFoundryVersion,
  isFoundry8
};
