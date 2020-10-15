import ImageHandler from "../ImageHandler";

class PreCreateChatMessage {
    private static _instance: PreCreateChatMessage;

    private constructor() {
    }

    public static getInstance(): PreCreateChatMessage {
        if (!PreCreateChatMessage._instance) PreCreateChatMessage._instance = new PreCreateChatMessage();
        return PreCreateChatMessage._instance;
    }

    /**
     * This function returns the chat message content with all the image links replaced with
     * actual images
     *
     * @param content - ChatMessage content
     */
    private _processMessage(content: string): any {
        return ImageHandler.replaceImagesInText(content);
    }

    /**
     * Adding a hook on preCreateChatMessage to get the message before is posted in chat and to
     * manipulate the data
     */
    public preCreateChatMessageHook(message: any, options: any): void {
        if (!message?.content) return;

        const {content, changed} = this._processMessage(message.content);
        if (!changed) return;

        message.content = content;
        options.chatBubble = !changed;
    }
}

export default PreCreateChatMessage.getInstance();