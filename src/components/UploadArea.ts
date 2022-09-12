import {htmlToElement, insertBefore} from '../utils/Utils'


const getUploadAreaHtmlElement = (): HTMLElement | null => htmlToElement(`<div id="ci-chat-upload-area"></div>`)

export const initUploadArea = (sidebarHtmlElement: HTMLElement) => {
  const chatControlsHtmlElement: HTMLElement | null = sidebarHtmlElement.querySelector('#chat-controls')
  const uploadAreaHtmlElement = getUploadAreaHtmlElement()

  if (!chatControlsHtmlElement || !uploadAreaHtmlElement) return
  insertBefore(uploadAreaHtmlElement, chatControlsHtmlElement, sidebarHtmlElement)
}
