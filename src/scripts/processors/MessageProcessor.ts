import {t} from '../utils/Utils'

const imageMarkdownReg = /!\s*ci\s*\|\s*(.+?)\s*!/gi

const imageTemplate = (src: string): string => `<div class="ci-message-image"><img src="${src}" alt="${t('unableToLoadImage')}"></div>`

export const processMessage = (message: string): string => {
  if (!message.match(imageMarkdownReg)) return message

  return message.replaceAll(imageMarkdownReg, (m: string, src: string) => imageTemplate(src.replaceAll('"', '&quot;')))
}
