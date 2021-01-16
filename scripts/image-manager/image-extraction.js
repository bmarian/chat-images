'use strict';

const DOM_PARSER = new DOMParser(),
    // a list of "special" URLs that for some reason or another are shown
    // as broken links
    SPECIAL_URLS = ['static.wikia'].join('|');

/**
 * Determines if the URL is one that can't be loaded. This list can't be automated
 * because the image actually loads but for example in the case of static.wikia you
 * don't have the necessary permissions to see it, fix #22
 *
 * @param {string} URL
 *
 * @return {string}
 */
function handleSpecialURL(URL) {
    return (new RegExp(SPECIAL_URLS).test(URL)) ? null : URL;
}

/**
 * Extract the URL from the event data by checking if it has an img element
 * and getting it's src, if nothing found it returns null
 *
 * @param {Object} evData
 *
 * @return {string | null}
 */
function extractURLFromEventData(evData) {
    const HTML = evData.getData('text/html');
    if (!HTML) return null;

    const img = DOM_PARSER.parseFromString(HTML, 'text/html').querySelector('img');
    if (!img) return null;

    return handleSpecialURL(img.src);
}

/**
 * Returns the first image file found in event data, if nothing is found
 * it returns null
 *
 * @param {Object} evData
 *
 * @return {File}
 */
function extractFileFromEventData(evData) {
    const items = evData?.items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item?.type?.includes('image')) return item.getAsFile();
    }
    return null;
}

/**
 * Extracts an image from the Paste/Drop event, and it returns
 * the URL or the file if the URL was not found
 *
 * @param {Event} event - drop/paste event
 *
 * @return {string | File}
 */
function extractImageFromEvent(event) {
    const evData = event?.clipboardData || event?.dataTransfer;
    if (!evData) return null;

    // enhance #11: first we try extracting the URL from the event data,
    // e.g. coping an image from google, the clipboard data has the HTML
    // elements, including the image. This can save a lot of data and traffic
    // on hosted servers
    return extractURLFromEventData(evData) || extractFileFromEventData(evData);
}

export {
    extractImageFromEvent
};
