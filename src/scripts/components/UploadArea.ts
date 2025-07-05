import { before, create, find } from '../utils/JqueryWrappers'
import { isVeriosnAfter13 } from '../utils/Utils'

const createUploadArea = (): JQuery => create(`<div id="ci-chat-upload-area" class="hidden"></div>`)

export const initUploadArea = (sidebar: JQuery) => {
  const chatControlsSelector = isVeriosnAfter13() ? '.chat-controls' : '#chat-controls'

  const chatControls: JQuery = find(chatControlsSelector, sidebar)
  const uploadArea: JQuery = createUploadArea()
  before(chatControls, uploadArea)
}
