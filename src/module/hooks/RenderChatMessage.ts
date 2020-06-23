import utils from "../utils";

class RenderChatMessage {

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
        const image = container.querySelector(`.${utils.moduleName}-image`);
        const previewButton = container.querySelector(`.${utils.moduleName}-expand-preview-button`);
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

        const containers = html[0].querySelectorAll(`.${utils.moduleName}-image-container`);
        if (!containers) return;

        const that = this;
        containers.forEach((container: any): void => {
            const buttons = container.querySelectorAll(`.${utils.moduleName}-expand-preview-button`);

            buttons.forEach((button: any): void => {
                button.addEventListener('click', (): void => {
                    that._buttonClickEventListener(container);
                });
            });
        });
        utils.debug('Event added to preview button.', false);
    }
}

export default new RenderChatMessage();