import {append, create, find, on, trigger} from '../utils/JqueryWrappers'
import {t} from '../utils/Utils'

let savedSidebarJQueryElement: JQuery | null = null

const createUploadButtonJqueryElement = (): JQuery => create(`<a class="ci-upload-image" title="${t('uploadButtonTitle')}"><i class="fas fa-upload"></i></a>`)
const createHiddenUploadInputJqueryElement = (): JQuery => create(`<input type="file" accept="image/*" class="ci-upload-image-hidden-input">`)
const getuploadButtonJqueryElement = (): JQuery | null => savedSidebarJQueryElement ? find('.ci-upload-image', savedSidebarJQueryElement) : null

const setupEvents = (uploadButtonJqueryElement: JQuery, hiddenUploadInputJqueryElement: JQuery) => {
  const hiddenUploadInputChangeEventHandler = (evt: Event) => {
    const currentTarget: HTMLInputElement = evt.currentTarget as HTMLInputElement
    console.log(currentTarget.files)
  }
  const uploadButtonClickEventHandler = (evt: Event) => {
    evt.preventDefault()
    trigger(hiddenUploadInputJqueryElement, 'click')
  }

  on(hiddenUploadInputJqueryElement, 'change', hiddenUploadInputChangeEventHandler)
  on(uploadButtonJqueryElement, 'click', uploadButtonClickEventHandler)
}

export const initUploadButton = (sidebarJQueryElement: JQuery) => {
  if (!savedSidebarJQueryElement) savedSidebarJQueryElement = sidebarJQueryElement

  const controlButtonsJqueryElement: JQuery = find('.control-buttons', savedSidebarJQueryElement)
  const uploadButtonJqueryElement: JQuery = createUploadButtonJqueryElement()
  const hiddenUploadInputJqueryElement: JQuery = createHiddenUploadInputJqueryElement()

  append(controlButtonsJqueryElement, uploadButtonJqueryElement)
  append(controlButtonsJqueryElement, hiddenUploadInputJqueryElement)
  setupEvents(uploadButtonJqueryElement, hiddenUploadInputJqueryElement)
}

