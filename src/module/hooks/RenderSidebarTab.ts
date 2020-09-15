import ImageHandler from "../ImageHandler";
import Utils from "../Utils";
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
        let spinner = document.querySelector(`#${Utils.moduleName}-spinner`);

        if (enable) {
            if (!spinner) {
                spinner = document.createElement('DIV');
                spinner.id = `${Utils.moduleName}-spinner`;
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
    private _toggleChat(chat: any, disabled: boolean): void {
        this._toggleSpinner(chat, disabled);

        if (disabled) {
            chat.setAttribute('disabled', 'true');
        } else {
            chat.removeAttribute('disabled');
            chat.focus();
        }
    }

    private _createChatMessageWithBlobImage(chat: any, imageBlob: Blob): void {
        const renderSidebarTabInstance = this;
        this._toggleChat(chat, true);

        const reader = new FileReader();
        reader.onload = (event: any): any => {
            const content = ImageHandler.buildImageHtml(event.target.result, true);
            ChatMessage.create({content}).then(() => {
                renderSidebarTabInstance._toggleChat(chat, false);
            });
        };
        reader.readAsDataURL(imageBlob);
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

        const whereToSave = Settings.getSetting('whereToSavePastedImages');
        if (whereToSave === 'dataFolder') {
            FilePicker.upload('data', 'UploadedChatImages', imageBlob, {}).then(() => {
                console.log('IT WORKED');
            });
        } else {
            this._createChatMessageWithBlobImage(chat, imageBlob);
        }
    }

    /**
     * Build a warning dialog
     *
     * @param chat - chat html object (should be the default textarea)
     * @param imageBlob - image blob
     * @private
     */
    private _createWarningDialog(chat: any, imageBlob: Blob): Dialog {
        const renderSidebarTabInstance = this;
        let tookAction = false;

        this._toggleChat(chat, true);
        return new Dialog({
            title: 'Warning',
            content: 'You\'re about to send a file, are you sure?',
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: () => {
                        tookAction = true;
                        renderSidebarTabInstance._sendMessageInChat(chat, imageBlob);
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'No',
                    callback: () => {
                        tookAction = true;
                        renderSidebarTabInstance._toggleChat(chat, false);
                    }
                }
            },
            default: 'ok',
            close: () => {
                if (!tookAction) {
                    renderSidebarTabInstance._toggleChat(chat, false);
                }
            }
        });
    }

    /**
     * Show a warning if needed and send the message
     *
     * @param warning - true, if we need to show a warning
     * @param chat - chat html object (should be the default textarea)
     * @param imageBlob - image blob
     * @private
     */
    private _warnAndSendMessage(warning: boolean, chat: any, imageBlob: Blob): void {
        if (!chat || !imageBlob) return;

        if (warning) {
            this._createWarningDialog(chat, imageBlob).render(true);
        } else {
            this._sendMessageInChat(chat, imageBlob);
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
        this._warnAndSendMessage(hasWarningOnPaste, chat, ImageHandler.getBlobFromEvents(event));
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
        this._warnAndSendMessage(hasWarningOnDrop, chat, ImageHandler.getBlobFromEvents(event));
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