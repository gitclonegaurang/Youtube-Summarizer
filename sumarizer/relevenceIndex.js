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
  
      console.log(generateOpenaiRelevanceIndex(videoTitle, transcript));
      // alert(generateOpenaiRelevanceIndex(videoTitle, transcript));
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error getting summary. Please check the console for more details.");
    }
  }
  async function generateOpenaiRelevanceIndex(title, text) {
    const apiUrl = "https://api.openai.com/v1/chat/completions"; // Update with the correct API endpoint
  
    // Extract 10 words related to the title
    const titleWords = title.split(" ").slice(0, 10);
  
    const prompt = `I will give you the title of a video which is:\n${title}\nand the captions of the whole video are:\n${text}\nGive value in percentage how relevant the information in the video is regarding the title. Answer me in very short`;
  
    const requestData = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
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
  
      // Get the content from the OpenAI response
      const content = response.data.choices[0].message.content;
  
      // Count the number of title words appearing in the content
      const matchingWords = titleWords.filter((word) => content.includes(word));
  
      // Display the content and the number of matching words
    //   alert(`${content} according to AI \n`);
      const relevenceIndex = document.getElementById("relevenceIndexID");
      relevenceIndex.innerText =`${content} according to AI \n`;

    } catch (error) {
      throw new Error(`OpenAI API Error: ${error.response.data.error.message}`);
    }
  }