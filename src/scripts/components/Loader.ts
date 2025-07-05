import { append, attr, create, find, focus, remove, removeAttr } from '../utils/JqueryWrappers'
import { isVeriosnAfter13 } from '../utils/Utils'

const toggleChat = (chat: JQuery, toggle: boolean) => {
  if (!toggle) {
    attr(chat, 'disabled', true)
    return
  }
  removeAttr(chat, 'disabled')
  focus(chat)
}

const toggleSpinner = (chatForm: JQuery, toggle: boolean) => {
  const spinnerId = 'ci-spinner'
  const spinner = find(`#${spinnerId}`, chatForm)

  if (!toggle && spinner[0]) {
    remove(spinner)
    return
  }

  if (toggle && !spinner[0]) {
    const newSpinner = create(`<div id="${spinnerId}"></div>`)
    append(chatForm, newSpinner)
  }
}

export const getUploadingStates = (sidebar: JQuery) => {
  const chatFormQuery = isVeriosnAfter13() ? '.chat-form' : '#chat-form'
  const chatForm = find(chatFormQuery, sidebar)
  const chat = find('#chat-message', sidebar)

  return {
    on() {
      toggleChat(chat, false)
      toggleSpinner(chatForm, true)
    },
    off() {
      toggleChat(chat, true)
      toggleSpinner(chatForm, false)
    },
  }
}
