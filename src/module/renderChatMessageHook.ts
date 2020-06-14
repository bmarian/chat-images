class RenderChatMessageHook {

    private _buttonClickEventListener(container: any): void {
        console.log(container);
    }

    public addImagePreviewButton(_0: any , html: any, _1: any):void {
        if (!(html && html[0])) {
            return;
        }

        const container = html[0].querySelector('.chat-images-image-container');
        if (container) {
            const that = this;
            const buttons = container.querySelectorAll('.chat-images-expand-preview-button');

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    that._buttonClickEventListener(container);
                });
            });
        }
    }
}

export default new RenderChatMessageHook();