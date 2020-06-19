class RenderChatMessageHook {

    private _buttonClickEventListener(button: any, container: any): void {
        const image = container.querySelector('.chat-images-image');
        const previewButton = container.querySelector('.chat-images-expand-preview-button');
        if (!image || !previewButton) {
            return;
        }

        const popout = new ImagePopout(image.src, {
            title: "Chat Image",
            editable: false,
            shareable: false,
        });

        popout.render(true);
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