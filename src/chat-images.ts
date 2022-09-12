import './styles/chat-images.scss'

Hooks.once('init', () => {
  console.log('Init')
})

Hooks.on('renderSidebarTab', (_0: never, sidebarJQueryElement: JQuery) => {
  const sidebarHTMLElement: HTMLElement = sidebarJQueryElement[0]
  const chat: HTMLElement | null = sidebarHTMLElement.querySelector('#chat-message')
  if (!chat) return
})

