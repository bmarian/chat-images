class RenderChatMessageHook {

    /**
     * Renders immediately an ImagePopout with the received image
     *
     * @param image - image src (url/base64)
     * @private
     */
    private _renderPopout(image: any): void {
        if (!image) return;

        const popout = new ImagePopout(image, {
            editable: false,
            shareable: false,
        });
        popout.render(true);
    }

    /**
     * Event listen for the preview button, if triggered (on click) opens an ImagePopout with its
     * respective image
     *
     * @param container - image container, contains the image and the button
     * @private
     */
    private _buttonClickEventListener(container: any): void {
        const image = container.querySelector('.chat-images-image');
        const previewButton = container.querySelector('.chat-images-expand-preview-button');
        if (!image || !previewButton) return;

        this._renderPopout(image.src);
    }

    /**
     * This function checks if a message has preview buttons and if it has adds the preview event
     *
     * @param html - The chat message html
     */
    public addImagePreviewButton(html: any): void {
        if (!(html && html[0])) return;

        const container = html[0].querySelector('.chat-images-image-container');
        if (!container) return;

        const that = this;
        const buttons = container.querySelectorAll('.chat-images-expand-preview-button');

        buttons.forEach((button: any): void => {
            button.addEventListener('click touch', (): void => {
                that._buttonClickEventListener(container);
            });
        });
    }
}

export default new RenderChatMessageHook();