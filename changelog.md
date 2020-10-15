# v1.0.0
- [x] Support for image links
- [x] Support for copy-paste
- [x] Support for drag and drop from file explorer
- [x] Preview for images

# v1.1.0
- [x] Add settings for warning dialog
- [x] Cleanup and document the code
- [x] Moved the module name in a global variable
- [x] Tested compatibility with 0.6.3

#### Bugs 
- [x] When having multiple images in the same message the preview button doesn't work
- [x] Rewrite the css for the spinner to have a relative position to the chat (incompatible with dice tray)
- [x] Preview button alignment.
- [x] Non image links were affected by the PreCreateChatMessage hook

# v1.1.1
- [x] Debugging and stack tracing ( nice for me I guess `¯\_(ツ)_/¯` )
- [x] Tested compatibility with 0.6.4

#### Bugs
- [X] Disable bubbles for converted chat messages
- [x] Added a default action to the warning dialog

# v1.1.2
- [x] Restricted the image regex to only target messages with a single url.
- [x] Tested compatibility with 0.6.5

# v1.1.3
- [x] Fixed private rolls not being private. Bubbles show what you rolled.

# v1.1.4
- [x] Tested compatibility with 0.7.0

# v2.0.0
#### This might be the last update:

- [x] Support for saving images inside the data folder
- [x] Removed the useless preview button, you can just click the chat message now
- [x] Reworked some functions to make it easier to read

# v2.0.1
#### Update v2.0.0 is a liar

- [x] Fixed the spinner not showing for file upload
- [x] Added a `cursor: pointer` to the images in chat to represent that you can click on them
- [x] Made the path added to `image.src` to be relative

# v2.0.3
- [x] Moved the warning settings to be at user level

# v2.0.4
- [x] Updated it for foundry 0.7.4
