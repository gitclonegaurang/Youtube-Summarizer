const axios = require("axios");
const YoutubeCaptionsScraper = require("youtube-captions-scraper");

// Set your OpenAI API key
const openaiApiKey = "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";

async function getYouTubeTranscriptionAndSummary(videoUrl) {
  try {
    // Extract video ID from the URL
    const videoId = videoUrl.split("v=")[1];

    // Fetch video title
    const videoInfoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=AIzaSyAfju-BUPNovN-L6WIKwD2n6YQZkC3HO3Q`
    );
    const videoTitle = videoInfoResponse.data.items[0].snippet.title;

    // Fetch captions
    const captions = await YoutubeCaptionsScraper.getSubtitles({
      videoID: videoId,
      lang: "en", // Specify the language for captions
    });

    // Extract and print the transcript
    const transcript = captions.map((entry) => entry.text).join(" ");
    console.log(`Video Title: ${videoTitle}`);
    // console.log("Transcript:");
    // console.log(transcript);

    // Generate a summary using OpenAI API
    const summary = await generateOpenaiSummary(transcript);
    console.log("Summary:");
    console.log(summary);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Example usage
const videoUrl = "https://www.youtube.com/watch?v=YompsDlEdtc";
getYouTubeTranscriptionAndSummary(videoUrl);

async function generateOpenaiSummary(text) {
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // Update with the correct API endpoint

  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: text },
    ],
    max_tokens: 150, // Adjust based on your preference
    temperature: 0.7, // Adjust based on your preference
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestData, config);
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
  }
}
