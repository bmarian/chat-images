import ImageHandler from "../ImageHandler";
import {MODULE_NAME} from "../util";
import {getSetting, UPLOAD_FOLDER_PATH} from "../settings";
import Compressor from '../compressor/compressor.esm.js'

class RenderSidebarTab {
    private static _instance: RenderSidebarTab;
    private constructor() {
    }
    public static getInstance(): RenderSidebarTab {
        if (!RenderSidebarTab._instance) RenderSidebarTab._instance = new RenderSidebarTab();
        return RenderSidebarTab._instance;
    }
    private _toggleSpinner(chat: any, enable: boolean): void {
        const chatForm = chat.parentNode;
        let spinner = document.querySelector(`#${MODULE_NAME}-spinner`);

        if (enable) {
            if (!spinner) {
                spinner = document.createElement('DIV');
                spinner.id = `${MODULE_NAME}-spinner`;
                chatForm.prepend(spinner);
            }
        } else {
            if (spinner) chatForm.removeChild(spinner);
        }
    }
    private _toggleChat(chat: any, disabled: boolean): void {
        this._toggleSpinner(chat, disabled);

        if (disabled) {
            chat.setAttribute('disabled', 'true');
        } else {
            chat.removeAttribute('disabled');
            chat.focus();
        }
    }
    private _hasPlayerFileUploadPermission(): boolean {
        const uploadPermissions = game?.permissions?.FILES_UPLOAD;
        // @ts-ignore
        const userPermission = game?.user?.role;

        return uploadPermissions.length && uploadPermissions.includes(userPermission);
    }

    /**
     * Showing images as blobs in the chat for people who don't trust their players
     *
     * @param chat - chat html element
     * @param imageBlob - image blob
     * @private
     */
    private _createChatMessageWithBlobImage(chat: any, imageBlob: Blob): void {
        this._toggleChat(chat, true);

        const renderSidebarTabInstance = this;
        const reader = new FileReader();

        new Compressor(imageBlob, {
            quality: 0.5,
            success: (result) => {
                reader.onload = (event: any): any => {
                    const content = ImageHandler.buildImageHtml(event.target.result, true);
                    ChatMessage.create({content}).then(() => {
                        renderSidebarTabInstance._toggleChat(chat, false);
                    });
                };
                reader.readAsDataURL(result);
            }
        });
    }

    /**
     * Create a new chat message with a image file path from the data directory
     *
     * @param chat - chat html element
     * @param image - image file
     * @private
     */
    private _createChatMessageWithFilePath(chat: any, image: File): void {
        this._toggleChat(chat, true);

        const renderSidebarTabInstance = this;
        const uploadFolderPath = UPLOAD_FOLDER_PATH;
        const imageName = ImageHandler.generateRandomFileName(image.name);
        const imageToUpload = new File([image], imageName, {type: image.type})

        FilePicker.upload('data', uploadFolderPath, imageToUpload, {}).then((response: any) => {
            if (!response.path) {
                renderSidebarTabInstance._toggleChat(chat, false);
                return;
            }

            const content = ImageHandler.buildImageHtml(response.path, false);
            ChatMessage.create({content}).then(() => {
                renderSidebarTabInstance._toggleChat(chat, false);
            });

        }).catch(() => renderSidebarTabInstance._toggleChat(chat, false));
    }

    private _createChatMessageWithLinkFromClipboard(chat: any, image: string): void {
        this._toggleChat(chat, true);

        const renderSidebarTabInstance = this;

        const content = ImageHandler.buildImageHtml(image, false);
        ChatMessage.create({content}).then(() => {
            renderSidebarTabInstance._toggleChat(chat, false);
        });
    }

    /**
     * Create a new chat message with the pasted/dropped image
     *
     * @param chat - chat html element
     * @param imageBlob - image blob
     * @private
     */
    private _sendMessageInChat(chat: any, imageBlob: any): void {
        if (!imageBlob) return;

        if (typeof imageBlob === 'string') {
            return this._createChatMessageWithLinkFromClipboard(chat, imageBlob)
        }

        const whereToSave = getSetting('whereToSavePastedImages');
        const saveAsBlobIfUnableToUpload = getSetting('saveAsBlobIfCantUpload');
        const hasUploadPermission = this._hasPlayerFileUploadPermission();

        if (whereToSave === 'dataFolder' && hasUploadPermission) {
            this._createChatMessageWithFilePath(chat, <File>imageBlob);
        } else if (whereToSave === 'database') {
            this._createChatMessageWithBlobImage(chat, imageBlob);
        } else {
            if (!hasUploadPermission && !saveAsBlobIfUnableToUpload) {
                ui?.notifications?.warn('You don\'t have permissions to upload files!');
            } else {
                this._createChatMessageWithBlobImage(chat, imageBlob);
            }
        }
    }

}

export default RenderSidebarTab.getInstance();