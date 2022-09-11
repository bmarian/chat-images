import "./styles/chat-images.scss"
import {fromEvent} from "rxjs"

Hooks.once("init", () => {
  console.log("Init")
})

Hooks.on('renderSidebarTab', (_0: any, sidebarJQueryElement: JQuery) => {
  const sidebarHTMLElement: HTMLElement = sidebarJQueryElement[0]
  const chat: HTMLElement | null = sidebarHTMLElement.querySelector('#chat-message')
  if (!chat) return;

  fromEvent(chat, 'paste').subscribe((evt) => console.log(evt))
  fromEvent(chat, 'drop').subscribe((evt) => console.log(evt))
})
