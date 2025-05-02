import DocumentScanner from "react-native-document-scanner-plugin";
import { userService } from ".";
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

class ScannerService {
    async scanDocument(callback: (scannedImages: string[]) => void): Promise<void> {
        try {
            const { scannedImages } = await DocumentScanner.scanDocument();
            if (!scannedImages) {
                console.error("No images scanned.");
                return;
            }

            const userDate = userService.getCurrentUser();
            if (!userDate || !userDate.id) {
                console.error("User data is missing or incomplete. Cannot create group without a valid user ID.");
                return;
            }

            if (scannedImages && scannedImages.length > 0) {
                callback(scannedImages);
            }
        } catch (error) {
            console.error("Error scanning document:", error);
        }
    }

    async extractTextFromImage(uri: string) {
        try {
            const result: MlkitOcrResult = await MlkitOcr.detectFromUri(uri);
            const text = result.map(block => block.text).join('\n');
            return text;
        } catch (error) {
            console.error('Error during OCR:', error);
        }
    }
}

export const scannerService = new ScannerService();
