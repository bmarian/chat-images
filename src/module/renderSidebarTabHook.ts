import utils from "./utils";

class RenderSidebarTabHook {

    private _generateMessage(image: any): string {
        return `<div class="chat-images-image-container"><img src="${image}" alt="image"></div>`;
    }

    private _toggleSpinner(chat: any, enable: boolean): void {
        const chatForm = chat.parentNode;

        if (enable) {
            const spinner = document.createElement('DIV')
            spinner.id = 'chat-image-spinner';

            chatForm.prepend(spinner);
        } else {
            const spinner = document.querySelector('#chat-image-spinner');

            chatForm.removeChild(spinner);
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

    private _parseImage(chat: any, pasteEvent: any): void {
        const that = this;
        const reader = new FileReader();
        const items = pasteEvent?.clipboardData?.items;

        let blob = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i]?.type.includes('image')) {
                blob = items[i].getAsFile();
                break;
            }
        }

        if (blob !== null) {
            this._toggleChat(chat, true);
            reader.onload = event => {
                const chatData = {
                    content: that._generateMessage(event.target.result),
                }
                ChatMessage.create(chatData).then(() => {
                    that._toggleChat(chat, false);
                });
            };
            reader.readAsDataURL(blob);
        }
    }

    private _pasteEventListener(event: any) {
        const chat = event.target;
        if (chat.disabled) {
            return;
        }
        this._parseImage(chat, event);
    }

    public handleImagePaste(chat: any): void {
        chat.addEventListener('paste', this._pasteEventListener.bind(this));
    }
}

export default new RenderSidebarTabHook();