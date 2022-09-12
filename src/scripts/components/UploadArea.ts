import {before, create, find} from '../utils/JqueryWrappers'

const createUploadArea = (): JQuery => create(`<div id="ci-chat-upload-area" class="hidden"></div>`)

export const initUploadArea = (sidebar: JQuery) => {
  const chatControls: JQuery = find('#chat-controls', sidebar)
  const uploadArea: JQuery = createUploadArea()
  before(chatControls, uploadArea)
}
