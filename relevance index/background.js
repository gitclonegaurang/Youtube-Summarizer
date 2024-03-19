// background.js
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(
    tab.id,
    { message: "getYouTubeUrl" },
    function (response) {
      if (response) {
        var youtubeUrl = response.youtubeUrl;
        // Do something with the YouTube URL if needed
      }
    }
  );
});
