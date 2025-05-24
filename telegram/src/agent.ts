import axios from "axios";
import env from "./env";

type MessageResponse = {
    kind: "message";
    message: string;
} | {
    kind: "wrapup",
    summaries: Complaint[];
};

type Complaint = {
    title: string;
    categories: string[];
    message: string;
}

export function processMessage(message: string): MessageResponse {

}
