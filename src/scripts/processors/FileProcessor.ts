import {randomString, t} from '../utils/Utils'
import {addClass, append, create, find, on, remove, removeClass} from '../utils/JqueryWrappers'

type SaveValueType = {
  type: string,
  name: string,
  imageSrc: string | ArrayBuffer | null,
  id: string
}

let imageQueue: SaveValueType[] = []

const isFileIsImage = (file: File) => file.type && file.type.startsWith('image/')

const createImagePreviewJqueryElement = ({imageSrc, id}: SaveValueType): JQuery => create(
    `<div id="${id}" class="ci-upload-area-image">
            <i class="ci-remove-image-icon fa-regular fa-circle-xmark"></i>
            <img class="ci-image-preview" src="${imageSrc}" alt="${t('unableToLoadImage')}"/>
        </div>`)

const addEventToRemoveButton = (removeButtonJqueryElement: JQuery, saveValue: SaveValueType, uploadAreaJqueryElement: JQuery) => {
  const removeEventHandler = () => {
    const imageJqueryElement = find(`#${saveValue.id}`, uploadAreaJqueryElement)

    remove(imageJqueryElement)
    imageQueue = imageQueue.filter((imgData: SaveValueType) => saveValue.id !== imgData.id)

    if (imageQueue.length) return
    addClass(uploadAreaJqueryElement, 'hidden')
  }
  on(removeButtonJqueryElement, 'click', removeEventHandler)
}

const addImageToQueue = (saveValue: SaveValueType, sidebarJqueryElement: JQuery) => {
  const uploadAreaJqueryElement: JQuery = find('#ci-chat-upload-area', sidebarJqueryElement)
  if (!uploadAreaJqueryElement || !uploadAreaJqueryElement[0]) return

  const imagePreviewJqueryElement = createImagePreviewJqueryElement(saveValue)
  if (!imagePreviewJqueryElement || !imagePreviewJqueryElement[0]) return

  removeClass(uploadAreaJqueryElement, 'hidden')
  append(uploadAreaJqueryElement, imagePreviewJqueryElement)
  imageQueue.push(saveValue)

  const removeButtonJqueryElement = find('.ci-remove-image-icon', imagePreviewJqueryElement)
  addEventToRemoveButton(removeButtonJqueryElement, saveValue, uploadAreaJqueryElement)
}

const uploadedImagesFileReaderHandler = (file: File, sidebarJqueryElement: JQuery) => (evt: Event) => {
  const imageSrc = (evt.target as FileReader)?.result
  const saveValue = {type: file.type, name: file.name, imageSrc, id: randomString()}
  addImageToQueue(saveValue, sidebarJqueryElement)
}

export const processUploadedImages = (files: FileList, sidebarJqueryElement: JQuery) => {
  for (let i = 0; i < files.length; i++) {
    const file: File = files[i]
    if (!isFileIsImage(file)) continue

    const reader: FileReader = new FileReader()
    reader.addEventListener('load', uploadedImagesFileReaderHandler(file, sidebarJqueryElement))
    reader.readAsDataURL(file)
  }
}
