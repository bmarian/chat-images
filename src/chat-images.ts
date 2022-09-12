import './styles/chat-images.scss'
import {initUploadArea} from './components/UploadArea'

Hooks.once('init', () => {
  console.log('Init')
})

Hooks.on('renderSidebarTab', (_0: never, sidebarJQueryElement: JQuery) => {
  const sidebarHtmlElement: HTMLElement = sidebarJQueryElement[0]
  if (!sidebarHtmlElement) return

  // const chat: HTMLElement | null = sidebarHtmlElement.querySelector('#chat-message')

  initUploadArea(sidebarHtmlElement)
})
