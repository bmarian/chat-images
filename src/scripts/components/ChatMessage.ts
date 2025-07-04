import { find, on } from '../utils/JqueryWrappers'

export const initChatMessage = (chatMessage: JQuery) => {
  const images = find('.ci-message-image img', chatMessage)
  if (!images[0]) return

  const clickImageHandle = (evt: Event) => {
    const src = (evt.target as HTMLImageElement).src
    // @ts-ignore
    new ImagePopout(src, { editable: false, shareable: true }).render(true)
  }
  on(images, 'click', clickImageHandle)
}
