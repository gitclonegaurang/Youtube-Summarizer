"use strict";

async function getSubtitles({ videoID, lang = "en" }) {
  try {
    const response = await axios.get(`https://youtube.com/watch?v=${videoID}`);
    const data = response.data;

    console.log("scrperjsssssssssssss");
    console.log(videoID);
    // * ensure we have access to captions data
    if (!data.includes("captionTracks"))
      throw new Error(`Could not find captions for video: ${videoID}`);

    const regex = /"captionTracks":(\[.*?\])/;
    const match = regex.exec(data)[0];

    const { captionTracks } = JSON.parse(`{${match}}`);
    console.log(captionTracks);

    const subtitle =
      _.find(captionTracks, { vssId: `.${lang}` }) ||
      _.find(captionTracks, { vssId: `a.${lang}` }) ||
      _.find(captionTracks, ({ vssId }) => vssId && vssId.match(`.${lang}`));

    // * ensure we have found the correct subtitle lang
    if (!subtitle || (subtitle && !subtitle.baseUrl))
      throw new Error(`Could not find ${lang} captions for ${videoID}`);

    const transcriptResponse = await axios.get(subtitle.baseUrl);
    const transcript = transcriptResponse.data;

    const lines = transcript
      .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
      .replace("</transcript>", "")
      .split("</text>")
      .filter((line) => line && line.trim())
      .map((line) => {
        const startRegex = /start="([\d.]+)"/;
        const durRegex = /dur="([\d.]+)"/;

        const start = startRegex.exec(line)[1];
        const dur = durRegex.exec(line)[1];

        const htmlText = line
          .replace(/<text.+>/, "")
          .replace(/&amp;/gi, "&")
          .replace(/<\/?[^>]+(>|$)/g, "");

        const decodedText = he.decode(htmlText);
        const text = striptags(decodedText);

        return {
          start,
          dur,
          text,
        };
      });

    return lines;
  } catch (error) {
    throw new Error(`Error fetching subtitles: ${error.message}`);
  }
}

// Note: You should import necessary dependencies (axios, lodash, he, striptags) in your popup.js

// You can optionally export functions if needed:
// export { getSubtitles };

// OR

// Assign the function to a global variable if you want to use it in the popup.js
window.getSubtitles = getSubtitles;
