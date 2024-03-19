// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("getSummaryButton")
//     .addEventListener("click", function () {
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var youtubeUrl = tabs[0].url;
//         getSummaryFromYouTubeUrl(youtubeUrl);
//       });
//     });
// });

// async function getSummaryFromYouTubeUrl(youtubeUrl, lang = "en") {
//   try {
//     // Extract video ID from the YouTube URL
//     var videoId = youtubeUrl.split("v=")[1];

//     // Fetch captions
//     const captions = await getSubtitles({
//       videoID: videoId,
//       lang: "en", // Specify the language for captions
//     });

//     // Extract and print the transcript
//     const transcript = captions.map((entry) => entry.text).join(" ");
//     console.log("Transcript:");
//     console.log(transcript);

//     // Generate a single question based on the transcript
//     const question = generateQuestionFromTranscript(transcript);

//     // Display the question and options to the user
//     displayQuestionAndOptions(question);
//   } catch (error) {
//     console.error("Error:", error.message);
//     alert("Error getting summary. Please check the console for more details.");
//   }
// }

// async function generateQuestionFromTranscript(text) {
//   const apiUrl = "https://api.openai.com/v1/chat/completions"; // Update with the correct API endpoint

//   // Extract 10 words related to the title
//   // const titleWords = title.split(" ").slice(0, 10);

//   // const prompt = `I will give you the title of a video which is:\n${title}\nand the captions of the whole video are:\n${text}\nGive value in percentage how relevant the information in the video is regarding the title. Answer me in very short`;
//   const prompt = `Create and Give me 5 MCQ Questions from easy to hard with answers from the given transcript:\n${text}`
//   const requestData = {
//     model: "gpt-3.5-turbo",
//     messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       { role: "user", content: prompt },
//     ],
//     max_tokens: 150, // Adjust based on your preference
//     temperature: 0.7, // Adjust based on your preference
//   };

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "Bearer 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", // Replace with your OpenAI API key
//     },
//   };

//   try {
//     const response = await axios.post(apiUrl, requestData, config);

//     // Get the content from the OpenAI response
//     const content = response.data.choices[0].message.content;

//     // Count the number of title words appearing in the content
//     const matchingWords = titleWords.filter((word) => content.includes(word));

//     // Display the content and the number of matching words
//     alert(`${content} according to AI \n`);
//   } catch (error) {
//     throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
//   }
// }

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

    // Fetch captions
    const captions = await getSubtitles({
      videoID: videoId,
      lang: "en", // Specify the language for captions
    });

    // Extract and print the transcript
    const transcript = captions.map((entry) => entry.text).join(" ");
    console.log("Transcript:");
    console.log(transcript);

    // Generate a single question based on the transcript
    const question = await generateQuestionFromTranscript(transcript);
    console.log("xyzzzzzzzz");
    console.log(question);
    // Display the question to the user
    // alert(`Generated Question: ${question}`);
    const summaryPara = document.getElementById("SummarySpace");
    summaryPara.innerText = `Generated Question: ${question}`;
  } catch (error) {
    console.error("Error:", error.message);
    // alert("Error getting summary. Please check the console for more details.");
    const summaryPara = document.getElementById("SummarySpace");
    summaryPara.innerText = `Error getting summary. Please check the console for more details.`;
  }
}

async function generateQuestionFromTranscript(text) {
  const apiUrl = "https://api.openai.com/v1/chat/completions"; // Update with the correct API endpoint

  const prompt = `Create and Give me 3 MCQ Questions with answers from the given transcript:\n${text}`;
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    max_tokens: 200, // Adjust based on your preference
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
    console.log(response.data);
    // Get the content from the OpenAI response
    const content = response.data.choices[0].message.content;
    console.log("contenttttttttt");
    console.log(content);
    return content; // Return the generated question
  } catch (error) {
    throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
  }
}
