export const create = (html: string): JQuery => $(html)
export const before = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.before(newNode)
export const after = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.after(newNode)
export const find = (selector: string, parentNode?: JQuery): JQuery => parentNode ? parentNode.find(selector) : $(selector)
export const append = (parentNode: JQuery, newNode: JQuery): JQuery => parentNode.append(newNode)
// @ts-ignore
export const on = (parentNode: JQuery, eventType: string, eventFunction: Function): JQuery => parentNode.on(eventType, eventFunction)
export const trigger = (parentNode: JQuery, eventType: string): JQuery => parentNode.trigger(eventType)
