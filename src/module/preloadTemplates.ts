export const preloadTemplates = async function() {
	const templatePaths = [
		"modules/chat-images/templates/dialog-preview.html"
	];

	return loadTemplates(templatePaths);
}
