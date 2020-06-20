class ImageHandler {
    public urlRegex = /<a.*>(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    public imageUrlRegex = /\w+\.(jpg|jpeg|gif|png|tiff|bmp)/gi;

    /**
     * This function checks if an url is for an image
     *
     * @param link - url of the image
     * @private
     */
    private _isImageUrl(link: string): boolean {
        return !!link.match(this.imageUrlRegex);
    }

    /**
     * This function creates the HTML structure that will be shown in the chat
     *
     * @param image - (url/base64)
     * @param isBase64 - determines if an image is an url of a base64 string
     * @private
     */
    public buildImageHtml(image: string | ArrayBuffer, isBase64: boolean): string {
        const img = `<img class="chat-images-image" src="${image}" alt="chat-image">`;
        const link = isBase64 ? `<a class="hyperlink" href="${image}" target="_blank">${img}</a>` : img;
        const previewButton = `<button class="chat-images-expand-preview-button">
                                    <i class="fas fa-expand" aria-hidden="true"></i>
                               </button>`;
        return `<div class="chat-images-image-container">${previewButton}${link}</div>`;
    }

    /**
     * This function converts all the image links into actual images
     *
     * @param match
     * @param link - it only exists if the original link is detected and converted into a hyperlink
     * @private
     */
    private _changeLinksToImages(match: string, link?: string): string {
        const image = link ? link : match;
        return this._isImageUrl(image) ? this.buildImageHtml(image, false) : image;
    }

    /**
     * This function receives a string and converts all the image links into actual images
     *
     * @param message - text containing image links to change
     */
    public replaceImagesInText(message: string): string {
        if (!message) return;
        // TODO check if multiple links are detected correctly after issue 3109 is fixed
        // https://gitlab.com/foundrynet/foundryvtt/-/issues/3109
        return message.replace(this.urlRegex, this._changeLinksToImages.bind(this));
    }

    /**
     * This function extracts the image from a paste event or from a drop event.
     *
     * @param event - paste/drop event
     */
    public getBlobFromFile(event: any): Blob {
        const items = event?.clipboardData?.items || event?.dataTransfer?.items;

        let blob = null;
        for (let i = 0; i < items.length; i++) {
            if (items[i]?.type.includes('image')) {
                blob = items[i].getAsFile();
                break;
            }
        }
        return blob;
    }
}

export default new ImageHandler();