import { Document } from "@/services/Document";
import { generateUUID } from "./generator";

export const imagesUriToDocumentMapper = (groupId: string, imageUri: string): Document => ({
    id: generateUUID(),
    image_url: imageUri,
    type: "-",
    createdAt: new Date(),
    groupId
});

export const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
});

export const timeFormatter = (input: Date | string) => {
    const date = typeof input === "string" ? new Date(input) : input;
    return date
        .toLocaleString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replace(":", ".");
};