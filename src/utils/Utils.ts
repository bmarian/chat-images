export const htmlToElement = (html: string): HTMLElement | null => {
  const template = document.createElement('template')
  html.trim()
  template.innerHTML = html
  return template.content.firstChild as HTMLElement
}
export const insertAfter = (newNode: HTMLElement, referenceNode: HTMLElement, parentNode?: ParentNode) => {
  const referenceNodeParentNode: ParentNode | null = parentNode || referenceNode.parentNode
  if (!referenceNodeParentNode) return

  referenceNodeParentNode.insertBefore(newNode, referenceNode.nextSibling)
}
export const insertBefore = (newNode: HTMLElement, referenceNode: HTMLElement, parentNode?: ParentNode) => {
  const referenceNodeParentNode: ParentNode | null = parentNode || referenceNode.parentNode
  if (!referenceNodeParentNode) return

  referenceNodeParentNode.insertBefore(newNode, referenceNode)
}
