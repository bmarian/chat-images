import {before, create, find} from '../utils/JqueryWrappers'

const createUploadAreaJqueryElement = (): JQuery => create(`<div id="ci-chat-upload-area" class="hidden"></div>`)

export const initUploadArea = (sidebarJqueryElement: JQuery) => {
  const chatControlsJqueryElement: JQuery = find('#chat-controls', sidebarJqueryElement)
  const uploadAreaJqueryElement: JQuery = createUploadAreaJqueryElement()
  before(chatControlsJqueryElement, uploadAreaJqueryElement)
}
