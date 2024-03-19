
from youtube_transcript_api import YouTubeTranscriptApi

def get_youtube_transcription_with_timestamps(video_url):
    # Extract the video ID from the URL
    video_id = video_url.split("watch?v=")[-1]

    try:
        # Fetch the available transcripts for the video
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Select the desired transcript
        transcript = transcript_list.find_transcript(['hi']) #  'hi' yaha pe hindi ahiw amtlab video apni hindi mai hai

        # Fetch the transcript with timestamps
        transcript = transcript.fetch()

        # Format and print the transcript
        formatted_transcript = ""
        for entry in transcript:
            start_time = entry['start']
            duration = entry['duration']
            text = entry['text']
            formatted_transcript += f"Time: {start_time} - Text: {text}\n"

        return formatted_transcript

    except Exception as e:
        return str(e)


video_url = "https://www.youtube.com/watch?v=Ao0KrcZlgDQ"
print(get_youtube_transcription_with_timestamps(video_url))
   