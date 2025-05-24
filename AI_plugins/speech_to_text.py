import librosa
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

# tokenizer = Wav2Vec2CTCTokenizer("./vocab.json", unk_token="[UNK]", pad_token="[PAD]", word_delimiter_token="|")
processor = Wav2Vec2Processor.from_pretrained('boumehdi/wav2vec2-large-xlsr-moroccan-darija')
model=Wav2Vec2ForCTC.from_pretrained('boumehdi/wav2vec2-large-xlsr-moroccan-darija')


# load the audio data (use your own wav file here!)
input_audio, sr = librosa.load('./public/test.mp3', sr=16000)

# tokenize
input_values = processor(input_audio, return_tensors="pt", padding=True).input_values

# retrieve logits
logits = model(input_values).logits

tokens = torch.argmax(logits, axis=-1)

# decode using n-gram
transcription = processor.batch_decode(tokens)[0]

# print the output
print(transcription)
