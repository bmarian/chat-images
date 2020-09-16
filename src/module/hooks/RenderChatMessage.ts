import utils from "../Utils";

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
            shareable: true,
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
    private _clickEventListener(container: any): void {
        const image = container.querySelector(`.${utils.moduleName}-image`);
        if (!image) return;

        this._renderPopout(image.src);
    }

    /**
     * This function checks if a message has preview buttons and if it has adds the preview event
     *
     * @param html - The chat message html
     */
    private _addImagePreview(html: any): void {
        if (!(html && html[0])) return;

        const containers = html[0].querySelectorAll(`.${utils.moduleName}-image-container`);
        if (!containers) return;

        const that = this;
        containers.forEach((container: any): void => {
            container.addEventListener('click', (): void => {
                that._clickEventListener(container);
            });
        });
    }

    /**
     * Adding a hook on renderChatMessage to add events on all the preview buttons when
     * they get rendered
     */
    public RenderChatMessageHook(_0: any, html: any): void {
        this._addImagePreview(html);
    }
}

export default new RenderChatMessage();