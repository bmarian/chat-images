import utils from "./Utils";

class ImageHandler {
    private static _instance: ImageHandler;

    private constructor() {
    }

    public static getInstance(): ImageHandler {
        if (!ImageHandler._instance) ImageHandler._instance = new ImageHandler();
        return ImageHandler._instance;
    }

    public urlRegex = /^<a.*>(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>$/ig;
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
        const img = `<img class="${utils.moduleName}-image" src="${image}" alt="${utils.moduleName}">`;
        return `<div class="${utils.moduleName}-image-container">${img}</div>`;
    }

    /**
     * This function converts all the image links into actual images
     *
     * @param match
     * @param link
     * @private
     */
    private _changeLinksToImages(match: string, link: string): string {
        return this._isImageUrl(link) ? this.buildImageHtml(link, false) : match;
    }

    /**
     * This function receives a string and converts all the image links into actual images
     *
     * @param message - text containing image links to change
     */
    public replaceImagesInText(message: string): any {
        if (!message) return;
        return {
            content: message.replace(this.urlRegex, this._changeLinksToImages.bind(this)),
            changed: !!message.match(this.urlRegex)
        };
    }

    /**
     * This function extracts the image from a paste event or from a drop event.
     *
     * @param event - paste/drop event
     */
    public getBlobFromEvents(event: any): Blob {
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


    /**
     * Generate a random file name for images
     *
     * @param oldImageName - the original file name (used to get the extension for the file)
     */
    public generateRandomFileName(oldImageName: string): string {
        const imageExtension = oldImageName.substring(oldImageName.lastIndexOf('.'), oldImageName.length) || null;
        if (!imageExtension) return oldImageName;

        const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return randomName + imageExtension;
    }
}

export default ImageHandler.getInstance();