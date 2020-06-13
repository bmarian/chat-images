import utils from "./utils";

class PreCreateChatMessageHook {
    private _urlRegex = /<a class="hyperlink" href=".*" target="_blank">(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])<\/a>|(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

    private _buildImage(imgLink: string): string {
        return `<a class="hyperlink" href="${imgLink}" target="_blank"><img src="${imgLink}" alt="${imgLink}"></a>`;
    }

    private _parseMessage(match: string, link?: string): string {
        return link ? this._buildImage(link) : this._buildImage(match);
    }

    public processMessage(content: string): string {
        const parsedContent = content.replace(this._urlRegex, this._parseMessage.bind(this));

        utils.debug(parsedContent);
        return parsedContent;
    }
}

export default new PreCreateChatMessageHook();