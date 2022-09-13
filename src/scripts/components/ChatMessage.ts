import {find, on} from '../utils/JqueryWrappers'

export const initChatMessage = (ciMessage: JQuery) => {
  const images = find('.ci-message-image img', ciMessage)
  if (!images[0]) return

  const clickImageHandle = (evt: Event) => {
    const src = (evt.target as HTMLImageElement).src
    new ImagePopout(src, {editable: false, shareable: true}).render(true)
  }
  on(images, 'click', clickImageHandle)
}
