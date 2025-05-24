

from PIL import Image
from google import genai

client = genai.Client(api_key="AIzaSyC5_lFc6k-bMNRv9QgZzhQUn5Wf2FWOiAo")

image = Image.open("C:/Users/yarak/Desktop/hackAi-NovaMind/AI_plugins/images/1-pothole.jpg")
response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents=[image, "You are a municipal inspector. A citizen has just sent you this photo/voice message reporting an issue in their neighborhood. Identify the problem (e.g., pothole, trash pile, broken streetlight), and write a clear, formal complaint to be submitted to the local commune. Note that the complaints are in Darija. Please note that if you don't have information, then please don't mention it (for examles, if you don't have a name or you don't know where something is located, then just don't say it)"]
)
print(response.text)