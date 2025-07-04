import { ORIGIN_FOLDER, t, FilePickerImplementation } from './Utils'


export const createUploadFolder = async (uploadLocation?: string) => {
  const location = uploadLocation || getSetting('uploadLocation')
  try {
    const folderLocation = await FilePickerImplementation().browse(ORIGIN_FOLDER, location)
    if (folderLocation.target === '.') await FilePickerImplementation().createDirectory(ORIGIN_FOLDER, location, {})
  } catch (e) {
    await FilePickerImplementation().createDirectory(ORIGIN_FOLDER, location, {})
  }
}

export const setSetting = (key: string, value: any) => {
  // @ts-ignore
  return (game as Game).settings.set('chat-images', key, value)
}

export const getSettings = () => [
  {
    key: 'uploadButton',
    options: {
      name: t('uploadButton'),
      hint: t('uploadButtonHint'),
      type: Boolean,
      default: true,
      config: true,
      requiresReload: true,
    },
  },
  {
    key: 'uploadLocation',
    options: {
      name: t('uploadLocation'),
      hint: t('uploadLocationHint'),
      type: String,
      default: 'uploaded-chat-images',
      scope: 'world',
      config: true,
      restricted: true,
      onChange: async (newUploadLocation: string) => {
        const defaultLocation = 'uploaded-chat-images'
        let location = newUploadLocation.trim()
        let shouldChangeLocation = false

        if (!location) {
          location = defaultLocation
          shouldChangeLocation = true
        }

        location = location.replace(/\s+/g, '-')
        if (newUploadLocation !== location) shouldChangeLocation = true

        await createUploadFolder(location)
        if (shouldChangeLocation) await setSetting('uploadLocation', location)
      },
    },
  },
]

export const registerSetting = (setting: { key: string, options: any }) => {
  // @ts-ignore
  return (game as Game).settings.register('chat-images', setting.key, setting.options)
}

export const getSetting = (key: string): any => {
  // @ts-ignore
  return (game as Game).settings.get('chat-images', key)
}
