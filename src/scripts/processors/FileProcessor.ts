import {randomString, t} from '../utils/Utils'
import {append, create, find, removeClass} from '../utils/JqueryWrappers'

const imageQueue = []

const isFileIsImage = (file: File) => file.type && file.type.startsWith('image/')

const createImagePreviewJqueryElement = ({imageSrc, id}: {type: string, imageSrc: string | ArrayBuffer | null, id: string}): JQuery => create(
    `<div id="${id}" class="ci-upload-area-image">
            <img src="${imageSrc}" alt="${t('unableToLoadImage')}"/>
        </div>`)

const addImageToQueue = (saveValue: {type: string, imageSrc: string | ArrayBuffer | null, id: string}, sidebarJqueryElement: JQuery) => {
  console.log('addImageToQueue')
  const uploadAreaJqueryElement: JQuery = find('#ci-chat-upload-area', sidebarJqueryElement)
  if (!uploadAreaJqueryElement || !uploadAreaJqueryElement[0]) return

  const imagePreviewJqueryElement = createImagePreviewJqueryElement(saveValue)
  if (!imagePreviewJqueryElement || !imagePreviewJqueryElement[0]) return

  removeClass(uploadAreaJqueryElement, 'hidden')
  append(uploadAreaJqueryElement, imagePreviewJqueryElement)
  imageQueue.push(saveValue)
}

const uploadedImagesFileReaderHandler = (file: File, sidebarJqueryElement: JQuery) => (evt: Event) => {
  const imageSrc = (evt.target as FileReader)?.result
  const saveValue = {type: file.type, imageSrc, id: randomString()}
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
