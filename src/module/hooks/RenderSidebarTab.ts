import ImageHandler from "../ImageHandler";
import utils from "../Utils";
import Settings from "../Settings";

class RenderSidebarTab {
    private static _instance: RenderSidebarTab;

    private constructor() {
    }

    public static getInstance(): RenderSidebarTab {
        if (!RenderSidebarTab._instance) RenderSidebarTab._instance = new RenderSidebarTab();
        return RenderSidebarTab._instance;
    }

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
     * @param chat - chat html object (should be the default textarea)
     * @param disabled - true, if the chat needs to be disabled
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
     * Build a warning dialog
     *
     * @param chat - chat html object (should be the default textarea)
     * @param image - image blob
     * @private
     */
    private _createWarningDialog(chat: any, image: any): Dialog {
        const renderSidebarTabInstance = this;
        let tookAction = false;

        this._disableChat(chat, true);
        return new Dialog({
            title: 'Warning',
            content: 'You\'re about to send a file, are you sure?',
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: () => {
                        tookAction = true;
                        renderSidebarTabInstance._sendMessageInChat(chat, image);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'No',
                    callback: () => {
                        tookAction = true;
                        renderSidebarTabInstance._disableChat(chat, false);
                    }
                }
            },
            default: 'ok',
            close: () => {
                if (!tookAction) {
                    renderSidebarTabInstance._disableChat(chat, false);
                }
            }
        });
    }

    /**
     * Show a warning if needed and send the message
     *
     * @param warning - true, if we need to show a warning
     * @param chat - chat html object (should be the default textarea)
     * @param image - image blob
     * @private
     */
    private _warnAndSendMessage(warning: boolean, chat: any, image: any): void {
        if (!chat || !image) return;

        if (warning) {
            this._createWarningDialog(chat, image).render(true);
        } else {
            this._sendMessageInChat(chat, image);
        }
    }

    /**
     * Event handler for the paste event
     *
     * @param event - paste event
     * @private
     */
    private _pasteEventListener(event: any): void {
        const chat = event.target;
        if (!chat || chat.disabled) return;

        const hasWarningOnPaste = Settings.getSetting('warningOnPaste');
        this._warnAndSendMessage(hasWarningOnPaste, chat, ImageHandler.getBlobFromFile(event));
    }

    /**
     * Event handler for the drop event
     *
     * @param event - drop event
     * @private
     */
    private _dropEventListener(event: any): void {
        const chat = event.target;
        if (!chat || chat.disabled) return;

        const hasWarningOnDrop = Settings.getSetting('warningOnDrop');
        this._warnAndSendMessage(hasWarningOnDrop, chat, ImageHandler.getBlobFromFile(event));
    }

    /**
     * Add event listeners for the chat textarea
     *
     * @param chat - chat html object (should be the default textarea)
     * @private
     */
    private _addChatEventListeners(chat: any): void {
        chat.addEventListener('paste', this._pasteEventListener.bind(this));
        chat.addEventListener('drop', this._dropEventListener.bind(this));
    }

    /**
     * Add a hook on renderSidebarTab, to add the paste/drop events on the chat window
     * TODO: and to add the image search button
     *
     * @param _0 - side panel object, ignored
     * @param sidePanel - side panel html
     * @public
     */
    public renderSidebarTabHook(_0: any, sidePanel: any): void {
        const sidePanelHTML = sidePanel[0];
        if (sidePanelHTML?.id !== 'chat') return;

        const chat = sidePanelHTML.querySelector('#chat-message');
        if (!chat) return;

        this._addChatEventListeners(chat);
    }
}

export default RenderSidebarTab.getInstance();