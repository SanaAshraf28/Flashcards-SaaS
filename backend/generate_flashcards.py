from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI
from dotenv import load_dotenv
import os
import logging
import requests

logging.basicConfig(level=logging.DEBUG)

load_dotenv(dotenv_path='../.env.local') # Load env variables

openai_api_key = os.getenv("OPENAI_API_KEY")
#os.environ['OPENAI_API_KEY'] = openai_api_key

openai_client = OpenAI()

def get_youtube_transcript(url): # Get transcript from the video
    try:    
        video_id = url.split("v=")[-1]
        logging.info(f"Attempting to retrieve transcript for video ID: {video_id}")
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([entry['text'] for entry in transcript])
        logging.info(f"Successfully retrieved transcript. Length: {len(full_text)} characters")
        return full_text
    except Exception as e:
        logging.error(f"Error retrieving transcript: {str(e)}", exc_info=True)
        return None
    
def generate_flashcards(text):
    prompt = f"""
                You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. 
                    Follow these guidelines to create the flashcards.

                    1. Create clear and concise questions for the front of the flashcard.
                    2. Provide accurate and infromative answers for the back of the flashcard.
                    3. Ensure that each flashcard focuses on a single concept or piece of information.
                    4. Use simple language to make the flashcards accessible to a wide range of learners.
                    5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
                    6. Avoid oversly complex or ambiguous phrasing in both questions and answers.
                    7. When appropriate, use mnenonics or memory aids to help reinforce the information.
                    8. Tailor the difficulty level of the flashcards to the user's specified preferences.
                    9. If given a body of text, extract the most improtant and relevant information for the flashcards.
                    10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
                    11. Only generate 10 flashcards


                    Remember, the goal is to facilitate effective learning and retention of information through these flashcards.
                    
                    These flashcards are being generated off of a youtube video transcript. Ensure you use that to answer the questions.

                    Return in the following JSON format
                    {{
                        "flashcards":[{{
                            "front":"string",
                            "back":"string"
                        }}]
                    }}

                    Please do not surround your response in ```json {{...}} ```
            """
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": text}
        ],
        max_tokens=1000
    )

    return response.choices[0].message.content


def generate_flashcards_from_youtube(youtube_url):
    logging.info(f"Generating flashcards for URL: {youtube_url}")
    transcript = get_youtube_transcript(youtube_url)
    if transcript:
        logging.info("Transcript retrieved successfully")
        flashcards_json = generate_flashcards(transcript)
        if flashcards_json:
            logging.info("Flashcards generated successfully")
            return flashcards_json
        else:
            logging.error("Failed to generate flashcards")
            return "Could not generate flashcards."
    else:
        logging.error("Failed to retrieve transcript")
        return "Could not retrieve transcript."
    
#print(generate_flashcards_from_youtube("https://www.youtube.com/watch?v=fDKIpRe8GW4"))