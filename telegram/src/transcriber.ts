import { inferenceClient } from "./hf";

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
    console.log("Transcribing audio...");
    const result = await inferenceClient.automaticSpeechRecognition({
        model: "boumehdi/wav2vec2-large-xlsr-moroccan-darija",
        endpointUrl: "https://df0sjohcmcyfxlvp.us-east4.gcp.endpoints.huggingface.cloud",
        inputs: new Blob([audioBuffer], { type: "audio/ogg" })
    });
    console.log("Transcription result:", result);
    return result.text;
}
