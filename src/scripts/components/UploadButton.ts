import {append, create, find, on, trigger} from '../utils/JqueryWrappers'
import {t} from '../utils/Utils'
import {processUploadedImages} from '../processors/FileProcessor'

const createUploadButtonJqueryElement = (): JQuery => create(`<a id="ci-upload-image" title="${t('uploadButtonTitle')}"><i class="fas fa-images"></i></a>`)

const createHiddenUploadInputJqueryElement = (): JQuery => create(`<input type="file" multiple accept="image/*" id="ci-upload-image-hidden-input">`)

const setupEvents = (uploadButtonJqueryElement: JQuery, hiddenUploadInputJqueryElement: JQuery, sidebarJqueryElement: JQuery) => {
  const hiddenUploadInputChangeEventHandler = (evt: Event) => {
    const currentTarget: HTMLInputElement = evt.currentTarget as HTMLInputElement
    const files: FileList | null = currentTarget.files
    if (!files) return

    processUploadedImages(files, sidebarJqueryElement)
    currentTarget.value = ''
  }
  const uploadButtonClickEventHandler = (evt: Event) => {
    evt.preventDefault()
    trigger(hiddenUploadInputJqueryElement, 'click')
  }

  on(hiddenUploadInputJqueryElement, 'change', hiddenUploadInputChangeEventHandler)
  on(uploadButtonJqueryElement, 'click', uploadButtonClickEventHandler)
}

export const initUploadButton = (sidebarJqueryElement: JQuery) => {
  const controlButtonsJqueryElement: JQuery = find('.control-buttons', sidebarJqueryElement)
  const uploadButtonJqueryElement: JQuery = createUploadButtonJqueryElement()
  const hiddenUploadInputJqueryElement: JQuery = createHiddenUploadInputJqueryElement()

  append(controlButtonsJqueryElement, uploadButtonJqueryElement)
  append(controlButtonsJqueryElement, hiddenUploadInputJqueryElement)
  setupEvents(uploadButtonJqueryElement, hiddenUploadInputJqueryElement, sidebarJqueryElement)
}

