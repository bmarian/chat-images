import {after, create, find} from '../utils/JqueryWrappers'

const getUploadAreaJqueryElement = (): JQuery => create(`<div id="ci-chat-upload-area"></div>`)

export const initUploadArea = (sidebarJQueryElement: JQuery) => {
  const chatControlsJqueryElement: JQuery = find('#chat-controls', sidebarJQueryElement)
  const uploadAreaJqueryElement: JQuery = getUploadAreaJqueryElement()

  after(chatControlsJqueryElement, uploadAreaJqueryElement)
}
