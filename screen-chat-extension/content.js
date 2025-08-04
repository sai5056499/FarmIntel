console.log('Screen Chat Extension content script loaded.'); 

// Listen for a message from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_page_content") {
    // Simple text extraction. Could be more sophisticated.
    const pageContent = document.body.innerText || "";
    sendResponse({ content: pageContent });
    return true; // Indicates you wish to send a response asynchronously
  }
}); 