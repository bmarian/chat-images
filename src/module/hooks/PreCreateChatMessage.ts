import ImageHandler from "../ImageHandler";

class PreCreateChatMessage {

    /**
     * This function returns the chat message content with all the image links replaced with
     * actual images
     *
     * @param content - ChatMessage content
     */
    public processMessage(content: string): any {
        return ImageHandler.replaceImagesInText(content);
    }
}

export default new PreCreateChatMessage();