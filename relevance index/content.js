// content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getYouTubeUrl") {
    sendResponse({ youtubeUrl: window.location.href });
  }
});
