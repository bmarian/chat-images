export const ORIGIN_FOLDER = 'data'
export const t = (text: string): string => (game as Game)?.i18n?.localize(`CI.${text}`) || ''
export const randomString = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
export const userCanUpload = (silent = false): boolean => {
  const userRole = (game as Game)?.user?.role
  const fileUploadPermissions = (game as Game)?.permissions?.FILES_UPLOAD

  if (!userRole || !fileUploadPermissions) {
    if (!silent) ui.notifications?.warn(t('uploadPermissions'))
    return false
  }

  const uploadPermission = fileUploadPermissions.includes(userRole)
  if (!uploadPermission && !silent) ui.notifications?.warn(t('uploadPermissions'))

  return uploadPermission
}

export const getFoundryVersion = () => (game as Game)?.version

export const isVeriosnAfter13 = () => Number(getFoundryVersion()) >= 13

export const FilePickerImplementation = () => isVeriosnAfter13() ? foundry.applications.apps.FilePicker.implementation : FilePicker
