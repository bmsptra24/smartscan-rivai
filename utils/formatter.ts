import { Document } from "@/services/Document";
import { generateID } from "./generator";
import * as FileSystem from 'expo-file-system';

export const imagesUriToDocumentMapper = (groupId: string, imageUri: string): Document => ({
    id: generateID('documents'),
    image_public_id: undefined,
    image_url: imageUri,
    type: "Analizing...",
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

export const uriToBase64 = async (uri: string): Promise<string> => {
    try {
        // Membaca file dari URI dan mengonversinya ke base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        // const base64Url = `data:image/jpeg;base64,${base64}`;
        // return base64Url;
        return base64;
    } catch (error) {
        console.error('Error converting URI to base64:', error);
        throw error;
    }
};