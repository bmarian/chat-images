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

const createImagePreview = ({imageSrc, id}: SaveValueType): JQuery => create(
    `<div id="${id}" class="ci-upload-area-image">
            <i class="ci-remove-image-icon fa-regular fa-circle-xmark"></i>
            <img class="ci-image-preview" src="${imageSrc}" alt="${t('unableToLoadImage')}"/>
        </div>`)

const addEventToRemoveButton = (removeButton: JQuery, saveValue: SaveValueType, uploadArea: JQuery) => {
  const removeEventHandler = () => {
    const image = find(`#${saveValue.id}`, uploadArea)

    remove(image)
    imageQueue = imageQueue.filter((imgData: SaveValueType) => saveValue.id !== imgData.id)

    if (imageQueue.length) return
    addClass(uploadArea, 'hidden')
  }
  on(removeButton, 'click', removeEventHandler)
}

const addImageToQueue = (saveValue: SaveValueType, sidebar: JQuery) => {
  const uploadArea: JQuery = find('#ci-chat-upload-area', sidebar)
  if (!uploadArea || !uploadArea[0]) return

  const imagePreview = createImagePreview(saveValue)
  if (!imagePreview || !imagePreview[0]) return

  removeClass(uploadArea, 'hidden')
  append(uploadArea, imagePreview)
  imageQueue.push(saveValue)

  const removeButton = find('.ci-remove-image-icon', imagePreview)
  addEventToRemoveButton(removeButton, saveValue, uploadArea)
}

const uploadedImagesFileReaderHandler = (file: File, sidebar: JQuery) => (evt: Event) => {
  const imageSrc = (evt.target as FileReader)?.result
  const saveValue = {type: file.type, name: file.name, imageSrc, id: randomString()}
  addImageToQueue(saveValue, sidebar)
}

export const processUploadedImages = (files: FileList, sidebar: JQuery) => {
  for (let i = 0; i < files.length; i++) {
    const file: File = files[i]
    if (!isFileIsImage(file)) continue

    const reader: FileReader = new FileReader()
    reader.addEventListener('load', uploadedImagesFileReaderHandler(file, sidebar))
    reader.readAsDataURL(file)
  }
}
