import { InferenceClient } from "@huggingface/inference";
import env from "./env";

export const inferenceClient = new InferenceClient(env.HF_TOKEN, {
    endpointUrl: "https://df0sjohcmcyfxlvp.us-east4.gcp.endpoints.huggingface.cloud",
});