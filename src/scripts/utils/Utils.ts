export const t = (text: string): string => (game as Game).i18n.localize(`CI.${text}`)
export const randomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
