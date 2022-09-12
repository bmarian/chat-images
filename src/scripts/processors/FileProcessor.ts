import {ORIGIN_FOLDER, randomString, t, UPLOAD_FOLDER} from '../utils/Utils'
import {addClass, append, create, find, on, remove, removeClass} from '../utils/JqueryWrappers'
import imageCompression from 'browser-image-compression'

export type SaveValueType = {
  type?: string,
  name?: string,
  file?: File,
  imageSrc: string | ArrayBuffer | null,
  id: string,
}

const DOM_PARSER = new DOMParser()

let imageQueue: SaveValueType[] = []

const isFileImage = (file: File | DataTransferItem) => file.type && file.type.startsWith('image/')

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

const uploadImage = async (saveValue: SaveValueType): Promise<string> => {
  const generateFileName = (saveValue: SaveValueType) => {
    const {type, name, id} = saveValue
    const fileExtension: string = name?.substring(name.lastIndexOf('.'), name.length) || type?.replace('image/', '') || 'jpeg'
    const nameWithoutExtension = name?.substring(0, name.lastIndexOf('.')) || name

    const concatFileName = `${nameWithoutExtension}_${id}`
    const newFileName = concatFileName.length > 200 ? id : concatFileName

    return `${newFileName}${fileExtension}`
  }

  try {
    const newName = generateFileName(saveValue)
    const compressedImage = await imageCompression(saveValue.file as File, {maxSizeMB: 1.5, useWebWorker: true, alwaysKeepResolution: true})
    const newImage = new File([compressedImage as File], newName, {type: saveValue.type})
    // @ts-ignore
    const imageLocation = await FilePicker.upload(ORIGIN_FOLDER, UPLOAD_FOLDER, newImage, {}, {notify: false})

    if (!imageLocation || !(imageLocation as FilePicker.UploadResult)?.path) return saveValue.imageSrc as string
    return (imageLocation as FilePicker.UploadResult)?.path
  } catch (e) {
    return saveValue.imageSrc as string
  }
}

const addImageToQueue = async (saveValue: SaveValueType, sidebar: JQuery) => {
  const uploadArea: JQuery = find('#ci-chat-upload-area', sidebar)
  if (!uploadArea || !uploadArea[0]) return

  const imagePreview = createImagePreview(saveValue)
  if (!imagePreview || !imagePreview[0]) return

  if (saveValue.file) saveValue.imageSrc = await uploadImage(saveValue)

  removeClass(uploadArea, 'hidden')
  append(uploadArea, imagePreview)
  imageQueue.push(saveValue)

  const removeButton = find('.ci-remove-image-icon', imagePreview)
  addEventToRemoveButton(removeButton, saveValue, uploadArea)
}

const imagesFileReaderHandler = (file: File, sidebar: JQuery) => async (evt: Event) => {
  const imageSrc = (evt.target as FileReader)?.result
  const saveValue = {type: file.type, name: file.name, imageSrc, id: randomString(), file}
  await addImageToQueue(saveValue, sidebar)
}

export const processImageFiles = (files: FileList | File[], sidebar: JQuery) => {
  for (let i = 0; i < files.length; i++) {
    const file: File = files[i]
    if (!isFileImage(file)) continue

    const reader: FileReader = new FileReader()
    reader.addEventListener('load', imagesFileReaderHandler(file, sidebar))
    reader.readAsDataURL(file)
  }
}

export const processDropAndPasteImages = (eventData: DataTransfer, sidebar: JQuery) => {
  const extractUrlFromEventData = (eventData: DataTransfer): string[] | null => {
    const html = eventData.getData('text/html')
    if (!html) return null

    const images = DOM_PARSER.parseFromString(html, 'text/html').querySelectorAll('img')
    if (!images || !images.length) return null

    // @ts-ignore
    return [...images].map((img) => img.src as string)
  }
  const urlsFromEventDataHandler = async (urls: string[]) => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      const saveValue = {imageSrc: url, id: randomString()}
      await addImageToQueue(saveValue, sidebar)
    }
  }

  const urls: string[] | null = extractUrlFromEventData(eventData)
  if (urls && urls.length) return urlsFromEventDataHandler(urls)

  const extractFilesFromEventData = (eventData: DataTransfer): File[] => {
    const items: DataTransferItemList = eventData.items
    const files = []
    for (let i = 0; i < items.length; i++) {
      const item: DataTransferItem = items[i]
      if (!isFileImage(item)) continue

      const file = item.getAsFile()
      if (!file) continue

      files.push(file)
    }
    return files
  }

  const files: File[] = extractFilesFromEventData(eventData)
  if (files && files.length) return processImageFiles(files, sidebar)
}

export const getImageQueue = (): SaveValueType[] => imageQueue

export const removeAllFromQueue = (sidebar: JQuery) => {
  while (imageQueue.length) {
    const imageData: SaveValueType | undefined = imageQueue.pop()
    if (!imageData) continue

    const imageElement = find(`#${imageData.id}`, sidebar)
    remove(imageElement)
  }

  const uploadArea: JQuery = find('#ci-chat-upload-area', sidebar)
  addClass(uploadArea, 'hidden')
}
