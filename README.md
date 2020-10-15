# Chat Images
![Downloads](https://img.shields.io/github/downloads/bmarian/chat-images/total?style=for-the-badge)
![License](https://img.shields.io/github/license/bmarian/chat-images?style=for-the-badge)
![GitHub Latest Release](https://img.shields.io/github/release/bmarian/chat-images?style=for-the-badge)
![Foundry Version](https://img.shields.io/badge/FoundryVTT-0.7.4-blueviolet?style=for-the-badge)

The title says it all, this module adds support for images in the chat: copy-paste, drag & drop, and links are automatically converted to images.

# Installation
- Go in the `Add-on Modules` section
- Click `Install Module`
- And search for Chat Images


Or you could install it manually, using one the following link: https://raw.githubusercontent.com/bmarian/chat-images/master/src/module.json

# Settings
 - `Warning on drop` / `Warning on paste`: will enable a warning dialog on drop/paste, to prevent accidental sharing.
 - `Files save location`: this has 2 options `Data folder` and `Database`, for `Data folder` all the images will be saved in your data folder `data\uploaded-chat-images`; for `Database`, all the images are embedded in the chat message and saved in chat.db, only use this method if you don't want to give your players file upload permissions because this leads to slower loading times and if you are using Forge this will fill your game storage super fast.
 - `Embed if upload is not possible`: this option will allow a user that doesn't have upload privileges to still upload images using the embed method described above.

![settings](https://i.imgur.com/4pngZtr.png)

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
