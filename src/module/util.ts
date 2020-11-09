const MODULE_TITLE = 'Chat Images';
const MODULE_NAME = 'chat-images';

const DEBUGGING = true;
const TRACE = true;

const consoleMessagePreset = [`%c${MODULE_TITLE} %c|`, 'background: #222; color: #bada55', 'color: #fff'];

const consoleTrace = (...output: any): any => {
    console.groupCollapsed(...consoleMessagePreset, ...output);
    console.trace();
    console.groupEnd();
};
const consoleLog = (...output: any): any => console.log(...consoleMessagePreset, ...output);
const log = (...output: any): void => DEBUGGING && (TRACE ? consoleTrace(...output) : consoleLog(...output));
const localize = (path: string): string => game.i18n.localize(`${MODULE_NAME}.${path}`);
const format = (path: string, data: any): string => game.i18n.format(`${MODULE_NAME}.${path}`, data);

export {MODULE_TITLE, MODULE_NAME, log, localize, format};