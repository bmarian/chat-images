import {append, create, find, on, trigger} from '../utils/JqueryWrappers'
import {t} from '../utils/Utils'
import {processUploadedImages} from '../processors/FileProcessor'

const createUploadButton = (): JQuery => create(`<a id="ci-upload-image" title="${t('uploadButtonTitle')}"><i class="fas fa-images"></i></a>`)

const createHiddenUploadInput = (): JQuery => create(`<input type="file" multiple accept="image/*" id="ci-upload-image-hidden-input">`)

const setupEvents = (uploadButton: JQuery, hiddenUploadInput: JQuery, sidebar: JQuery) => {
  const hiddenUploadInputChangeEventHandler = (evt: Event) => {
    const currentTarget: HTMLInputElement = evt.currentTarget as HTMLInputElement
    const files: FileList | null = currentTarget.files
    if (!files) return

    processUploadedImages(files, sidebar)
    currentTarget.value = ''
  }
  const uploadButtonClickEventHandler = (evt: Event) => {
    evt.preventDefault()
    trigger(hiddenUploadInput, 'click')
  }

  on(hiddenUploadInput, 'change', hiddenUploadInputChangeEventHandler)
  on(uploadButton, 'click', uploadButtonClickEventHandler)
}

export const initUploadButton = (sidebar: JQuery) => {
  const controlButtons: JQuery = find('.control-buttons', sidebar)
  const uploadButton: JQuery = createUploadButton()
  const hiddenUploadInput: JQuery = createHiddenUploadInput()

  append(controlButtons, uploadButton)
  append(controlButtons, hiddenUploadInput)
  setupEvents(uploadButton, hiddenUploadInput, sidebar)
}

