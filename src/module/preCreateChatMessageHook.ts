import utils from "./utils";

class PreCreateChatMessageHook {
    private _urlRegex = /<a class="hyperlink" href=".*" target=".*">(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    private _isImageURL(link: string): boolean {
        return !!link.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)/gi);
    }

    private _buildImage(imgLink: string): string {
        return `<div class="chat-images-image-container">
                    <button class="chat-images-expand-preview-button">
                        <i class="fas fa-expand" aria-hidden="true"></i>
                    </button>
                    <a class="hyperlink" href="${imgLink}" target="_blank">
                        <img src="${imgLink}" alt="${imgLink}">        
                    </a>
                </div>`;
    }

    private _parseMessage(match: string, link?: string): string {
        if (this._isImageURL(link ? link : match)) {
            return link ? this._buildImage(link) : this._buildImage(match);
        } else {
            return match;
        }
    }

    public processMessage(content: string): string {
        const parsedContent = content.replace(this._urlRegex, this._parseMessage.bind(this));

        utils.debug(parsedContent);
        return parsedContent;
    }
}

export default new PreCreateChatMessageHook();