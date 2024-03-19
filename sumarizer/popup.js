// popup.js

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("getSummaryButton")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var youtubeUrl = tabs[0].url;
        getSummaryFromYouTubeUrl(youtubeUrl);
      });
    });
});

async function getSummaryFromYouTubeUrl(youtubeUrl, lang = "en") {
  try {
    // Extract video ID from the YouTube URL
    var videoId = youtubeUrl.split("v=")[1];

    console.log(videoId);
    console.log("Fetching video title...");
    // Fetch video title using YouTube Data API
    const videoInfoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyCHKidgBYtqLLBxgj52o9Fxrj1VDChYXgE`
    );

    const videoTitle = videoInfoResponse.data.items[0].snippet.title;
    console.log(`Video Title: ${videoTitle}`);

    console.log("Fetching captions...");
    // Fetch captions using YouTube Data API
    const captionsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions?videoId=${videoId}&part=snippet&key=AIzaSyCHKidgBYtqLLBxgj52o9Fxrj1VDChYXgE`
    );
    console.log(captionsResponse);

    // Fetch captions
    const captions = await getSubtitles({
      videoID: videoId,
      lang: "en", // Specify the language for captions
    });

    console.log("captions jhatuuuuuuuu");
    console.log(captions);
    // Extract and print the transcript
    const transcript = captions.map((entry) => entry.text).join(" ");
    console.log("Transcript:");
    console.log(transcript);

    // Send the transcript to OpenAI for summary
    console.log("Generating summary...");
    const summary = await generateOpenaiSummary(transcript);
    console.log("Summary:");
    console.log(summary);

    // Do something with the summary, e.g., display it in a popup
    // alert("Summary: " + summary);
    const summaryPara = document.getElementById("SummarySpace");
    summaryPara.innerText = `Summary: ${summary}`;
  } catch (error) {
    console.error("Error:", error.message);
    alert("Error getting summary. Please check the console for more details.");
  }
}

async function generateOpenaiSummary(text) {
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // Update with the correct API endpoint

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Summarize the following:\n${text}` },
    ],
    max_tokens: 150, // Adjust based on your preference
    temperature: 0.7, // Adjust based on your preference
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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", // Replace with your OpenAI API key
    },
  };

  try {
    const response = await axios.post(apiUrl, requestData, config);
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
  }
}
