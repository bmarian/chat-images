class RenderChatMessageHook {

    private _togglePreviewButton(previewButton: any, disabled: boolean): void {
        if (disabled) {
            previewButton.setAttribute('disabled', 'true');
        } else {
            previewButton.removeAttribute('disabled');
        }
    }

    private _imagePopoutTemplate(image: any, previewButton: any): any {
        const that = this;
        const container = document.createElement('DIV');
        const img = document.createElement('img');

        container.className = 'chat-images-dialog-preview';
        img.className = 'chat-images-dialog-image';

        img.src = image;
        img.alt = 'image';

        container.appendChild(img);
        container.addEventListener('click', event => {
            that._togglePreviewButton(previewButton, false);
            container?.parentNode.removeChild(container);
        });

        return container;
    }

    private _buttonClickEventListener(button: any, container: any): void {
        const image = container.querySelector('.chat-images-image');
        const previewButton = container.querySelector('.chat-images-expand-preview-button');
        if (!image || !previewButton) {
            return;
        }
        this._togglePreviewButton(previewButton, true);
        const popout = this._imagePopoutTemplate(image.src, previewButton);
        document.body.prepend(popout);
    }

    public addImagePreviewButton(_0: any, html: any, _1: any): void {
        if (!(html && html[0])) {
            return;
        }

        const container = html[0].querySelector('.chat-images-image-container');
        if (container) {
            const that = this;
            const buttons = container.querySelectorAll('.chat-images-expand-preview-button');

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    that._buttonClickEventListener(this, container);
                });
            });
        }
    }
}

export default new RenderChatMessageHook();