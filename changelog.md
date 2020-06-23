# v1.0.0
- [x] Support for image links
- [x] Support for copy-paste
- [x] Support for drag and drop from file explorer
- [x] Preview for images

# v1.1.0
- [x] Add settings for warning dialog
- [x] Cleanup and document the code
- [x] Moved the module name in a global variable
- [x] Tested compatibility with 0.6.4

#### Bugs 
- [x] When having multiple images in the same message the preview button doesn't work
- [x] Rewrite the css for the spinner to have a relative position to the chat (incompatible with dice tray)
- [x] Preview button alignment.
- [x] Non image links were affected by the PreCreateChatMessage hook

# v1.1.1
- [ ] Add copy image right click menu
- [x] Debugging and stack tracing ( nice for me I guess `¯\_(ツ)_/¯` )
- [ ] Permissions

#### Bugs

- [ ] Hilarious but still a bug, bubbles don't work well with images:


![bubbles](https://i.imgur.com/N0pN9Vs.gif)

- [x] Added a default action to the warning dialog