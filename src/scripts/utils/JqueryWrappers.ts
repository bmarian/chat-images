// @ts-ignore
export const create = (html: string | HTMLElement): JQuery => $(html)
export const before = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.before(newNode)
export const after = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.after(newNode)
export const find = (selector: string, parentNode?: JQuery): JQuery => parentNode ? parentNode.find(selector) : $(selector)
export const append = (parentNode: JQuery, newNode: JQuery): JQuery => parentNode.append(newNode)
// @ts-ignore
export const on = (parentNode: JQuery, eventType: string, eventFunction: Function): JQuery => parentNode.on(eventType, eventFunction)
export const trigger = (parentNode: JQuery, eventType: string): JQuery => parentNode.trigger(eventType)
export const removeClass = (parentNode: JQuery, classString: string): JQuery => parentNode.removeClass(classString)
export const addClass = (parentNode: JQuery, classString: string): JQuery => parentNode.addClass(classString)
export const remove = (node: JQuery): JQuery => node.remove()
export const attr = (node: JQuery, attrId: string, attrValue?: any): string | JQuery | undefined => attrValue ? node.attr(attrId, attrValue) : node.attr(attrId)
export const removeAttr = (node: JQuery, attrId: string): JQuery => node.removeAttr(attrId)
export const focus = (node: JQuery): JQuery => node.focus()
export const scrollBottom = (node: JQuery): JQuery => node.animate({ scrollTop: node.height() })
// @ts-ignore
export const each = (node: JQuery, handler: Function): JQuery => node.each(handler)