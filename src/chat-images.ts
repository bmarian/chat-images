import './styles/chat-images.scss'
import {initUploadArea} from './scripts/components/UploadArea'
import {initUploadButton} from './scripts/components/UploadButton'
import {initChatSidebar} from './scripts/components/ChatSidebar'

const createUploadFolder = async () => {
  const origin = 'data'
  const folderPath = 'uploaded-chat-images'

  try {
    const location = await FilePicker.browse(origin, folderPath)
    if (location.target === '.') await FilePicker.createDirectory(origin, folderPath, {})
  } catch (e) {
    await FilePicker.createDirectory(origin, folderPath, {})
  }
}

Hooks.once('init', async () => {
  await createUploadFolder()
})

Hooks.on('renderSidebarTab', (_0: never, sidebar: JQuery) => {
  const sidebarElement: HTMLElement | null = sidebar[0]
  if (!sidebarElement) return

  const hasChatElement = sidebarElement.querySelector('#chat-message')
  if (!hasChatElement) return

  initUploadArea(sidebar)
  initUploadButton(sidebar)
  initChatSidebar(sidebar)
})
