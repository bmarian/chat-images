import {before, create, find} from '../utils/JqueryWrappers'

let savedSidebarJQueryElement: JQuery | null = null

const createUploadAreaJqueryElement = (): JQuery => create(`<div id="ci-chat-upload-area" class="hidden"></div>`)
const getUploadAreaJqueryElement = (): JQuery | null => savedSidebarJQueryElement ? find('#ci-chat-upload-area', savedSidebarJQueryElement) : null

export const initUploadArea = (sidebarJQueryElement: JQuery) => {
  if (!savedSidebarJQueryElement) savedSidebarJQueryElement = sidebarJQueryElement

  const chatControlsJqueryElement: JQuery = find('#chat-controls', savedSidebarJQueryElement)
  const uploadAreaJqueryElement: JQuery = createUploadAreaJqueryElement()
  before(chatControlsJqueryElement, uploadAreaJqueryElement)
}
