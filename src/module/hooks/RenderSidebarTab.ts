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

        if (enable) {
            const spinner = document.createElement('DIV')
            spinner.id = `${utils.moduleName}-spinner`;
            chatForm.prepend(spinner);
        } else {
            const spinner = document.querySelector(`#${utils.moduleName}-spinner`);
            chatForm.removeChild(spinner);
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
            });
        };
        reader.readAsDataURL(image);
    }

    /**
     * Event listener for past/drop
     *
     * @param event - paste/drop event
     * @private
     */
    private _pasteDropEventListener(event: any): void {
        const chat = event.target;
        if (chat.disabled) return;

        this._sendMessageInChat(chat, ImageHandler.getBlobFromFile(event));
    }

    /**
     * This function adds event listeners for paste and drop
     *
     * @param chat - chat input element
     */
    public handleImagePasteDrop(chat: any): void {
        chat.addEventListener('paste', this._pasteDropEventListener.bind(this));
        chat.addEventListener('drop', this._pasteDropEventListener.bind(this));
    }
}

export default new RenderSidebarTab();