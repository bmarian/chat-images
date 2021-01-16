# Chat Images
![GitHub Latest Release](https://img.shields.io/github/release/bmarian/chat-images?style=for-the-badge)
![Downloads](https://img.shields.io/github/downloads/bmarian/chat-images/total?style=for-the-badge)
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fchat-images&colorB=4aa94a&style=for-the-badge)

The title says it all, this module adds support for images in the chat: copy-paste, drag & drop, and links are automatically converted to images.

# Installation
- Go in the `Add-on Modules` section
- Click `Install Module`
- And search for Chat Images

# Settings
 - `Warning on drop` / `Warning on paste`: will enable a warning dialog on drop/paste, to prevent accidental sharing.
 - `Uploaded`/`Embedded files quality`: Determines the level of quality for the uploaded images, if set to `1` the image will be uploaded as is. A lower value will save space but will reduce the image quality.
 - `Files save location`: this has 2 options `Data folder` and `Database`, for `Data folder` all the images will be saved in your data folder `data\uploaded-chat-images`; for `Database`, all the images are embedded in the chat message and saved in chat.db, only use this method if you don't want to give your players file upload permissions because this leads to slower loading times and if you are using Forge this will fill your game storage super fast.
 - `Embed if upload is not possible`: this option will allow a user that doesn't have upload privileges to still upload images using the embed method described above.

![settings](https://i.imgur.com/YG3VKPR.png)

# Examples
### Automatically converted links
![link](https://i.imgur.com/2g1lhod.gif)

### Copy-paste images
![copy-paste](https://i.imgur.com/iTRWPSS.gif)

### Paste a screenshot
![screenshot](https://i.imgur.com/psfNXnY.gif)

### Drag & drop
![drag-and-drop](https://i.imgur.com/1DFAjQl.gif)

### Preview for uploaded images & show to players
![preview](https://i.imgur.com/eT7vaY7.gif)

### Warning dialog
![dialog](https://i.imgur.com/bTV4rnl.gif)
