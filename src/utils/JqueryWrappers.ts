export const create = (html: string): JQuery => $(html)
export const before = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.before(newNode)
export const after = (referenceNode: JQuery, newNode: JQuery): JQuery => referenceNode.after(newNode)
export const find = (selector: string, parentNode?: JQuery): JQuery => parentNode ? parentNode.find(selector) : $(selector)
