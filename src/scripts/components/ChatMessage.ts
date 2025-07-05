import { find, on } from '../utils/JqueryWrappers'
import { ImagePopoutImplementation, isVeriosnAfter13 } from '../utils/Utils'

export const initChatMessage = (chatMessage: JQuery) => {
  const images = find('.ci-message-image img', chatMessage)
  if (!images[0]) return

  const clickImageHandle = (evt: Event) => {
    const src = (evt.target as HTMLImageElement).src
    const imagePopup = ImagePopoutImplementation()

    if (isVeriosnAfter13()) {
      // @ts-ignore
      new imagePopup({ src, editable: false, shareable: true }).render(true)
    } else {
      // @ts-ignore
      new imagePopup(src, { editable: false, shareable: true }).render(true)
    }
  }
  on(images, 'click', clickImageHandle)
}
