import ImageHandler from "../ImageHandler";
import utils from "../utils";

class RenderSidebarTab {

    /**
     * This function shows a spinner over the chat
     *
     * @param chat - chat html element
     * @param enable - true if the spinner needs to be displayed
     * @private
     */
    private _toggleSpinner(chat: any, enable: boolean): void {
        const chatForm = chat.parentNode;
        let spinner = document.querySelector(`#${utils.moduleName}-spinner`);

        if (enable) {
            if (!spinner) {
                spinner = document.createElement('DIV');
                spinner.id = `${utils.moduleName}-spinner`;
                chatForm.prepend(spinner);
            }
        } else {
            if (spinner) chatForm.removeChild(spinner);
        }
    }

    /**
     * This function adds the disabled property on the chat input
     *
     * @param chat - chat html element
     * @param disabled - true if the chat needs to be disabled
     * @private
     */
    private _disableChat(chat: any, disabled: boolean): void {
        this._toggleSpinner(chat, disabled);

        if (disabled) {
            chat.setAttribute('disabled', 'true');
        } else {
            chat.removeAttribute('disabled');
            chat.focus();
        }
    }

    /**
     * This function adds a new ChatMessage if an image was pasted/dropped in the chat
     *
     * @param chat - chat html element
     * @param image - image blob
     * @private
     */
    private _sendMessageInChat(chat: any, image: any): void {
        if (!image) return;

        const reader = new FileReader();
        const that = this;

        this._disableChat(chat, true);
        reader.onload = (event: any): any => {
            const content = ImageHandler.buildImageHtml(event.target.result, true);
            ChatMessage.create({content}).then(() => {
                that._disableChat(chat, false);
                utils.debug('Image rendered in chat.');
            });
        };
        reader.readAsDataURL(image);
    }

    /**
     * This function handles showing a warning dialog
     *
     * @param warning - true if we need to show a warning
     * @param chat - chat html element
     * @param image - image blob
     * @private
     */
    private _handleWarnings(warning: boolean, chat: any, image: any): void {
        if (!image) return;
        if (!warning) {
            this._sendMessageInChat(chat, image);
            return;
        }
        const that = this;
        let tookAction = false;
        that._disableChat(chat, true);

        const dialog = new Dialog({
            title: 'Chat Images',
            content: 'You are about to add an image to the chat. Are you sure you want to do that?',
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: () => {
                        tookAction = true;
                        that._sendMessageInChat(chat, image);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'No',
                    callback: () => {
                        tookAction = true;
                        that._disableChat(chat, false);
                    }
                }
            },
            close: () => {
                if (!tookAction) that._disableChat(chat, false);
            }
        });
        dialog.render(true);
        utils.debug('Warning dialog rendered.');
    }

    /**
     * Event listener for past
     *
     * @param event - paste event
     * @private
     */
    private _pasteEventListener(event: any): void {
        const chat = event.target;
        if (chat.disabled) return;

        const warningOnPaste = game.settings.get(utils.moduleName, 'warningOnPaste');
        this._handleWarnings(warningOnPaste, chat, ImageHandler.getBlobFromFile(event));
    }

    /**
     * Event listener for drop
     *
     * @param event - drop event
     * @private
     */
    private _dropEventListener(event: any): void {
        const chat = event.target;
        if (chat.disabled) return;

        const warningOnDrop = game.settings.get(utils.moduleName, 'warningOnDrop');
        this._handleWarnings(warningOnDrop, chat, ImageHandler.getBlobFromFile(event));
    }

    /**
     * This function adds event listeners for paste and drop
     *
     * @param chat - chat input element
     */
    public handleImagePasteDrop(chat: any): void {
        chat.addEventListener('paste', this._pasteEventListener.bind(this));
        chat.addEventListener('drop', this._dropEventListener.bind(this));
    }
}

export default new RenderSidebarTab();