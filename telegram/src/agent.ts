
type MessageResponse = {
    kind: "message";
    message: string;
} | {
    kind: "wrapup",
    title: string;
    categories: string[];
    message: string;
};

type Complaint = {
}

export function processMessage(message: string): MessageResponse {
    return {
        kind: "wrapup",
        title: "UU",
        categories: ["JJJJ"],
        message: "frfrfrfr",
    };
}

