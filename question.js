const axios = require("axios");
const YoutubeCaptionsScraper = require("youtube-captions-scraper");

// Set your OpenAI API key
const openaiApiKey = "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";

async function getYouTubeTranscriptionAndQuestions(videoUrl) {
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
    console.log("Transcript:");
    console.log(transcript);

    // Generate MCQs based on the transcript
    const mcqs = generateMCQs(transcript, 5); // Generate 5 MCQs
    console.log("Multiple-Choice Questions:");
    console.log(mcqs);

    // Generate a summary using OpenAI API
    const summary = await generateOpenaiSummary(transcript);
    console.log("Summary:");
    console.log(summary);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function generateMCQs(text, numQuestions) {
  // Implement your logic for generating MCQs here
  // For simplicity, let's split the text into sentences and use them as questions
  const sentences = text.split(/[.!?]/).filter(Boolean);
  const mcqs = [];

  for (let i = 0; i < Math.min(numQuestions, sentences.length); i++) {
    const question = sentences[i].trim();
    const options = generateRandomOptions(question);
    const correctAnswer = options[0]; // For simplicity, the correct answer is the first option

    mcqs.push({
      question,
      options,
      correctAnswer,
    });
  }

  return mcqs;
}

function generateRandomOptions(correctAnswer) {
  // Implement your logic for generating random incorrect options
  // For simplicity, let's generate three random options
  const options = [correctAnswer];
  for (let i = 0; i < 3; i++) {
    const randomOption = generateRandomString();
    options.push(randomOption);
  }

  // Shuffle the options to randomize their order
  shuffleArray(options);

  return options;
}

function generateRandomString() {
  // Implement your logic for generating a random string for incorrect options
  // For simplicity, let's generate a random string of characters
  const randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

function shuffleArray(array) {
  // Function to shuffle an array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Example usage
const videoUrl = "https://www.youtube.com/watch?v=YompsDlEdtc";
getYouTubeTranscriptionAndQuestions(videoUrl);

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
