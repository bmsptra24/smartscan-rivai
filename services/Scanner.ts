import DocumentScanner from "react-native-document-scanner-plugin";
import { userService } from ".";
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';
import { Platform } from "react-native";
import Tesseract from 'tesseract.js';
import { showAlert } from "@/utils/alert";

class ScannerService {
    async scanDocument(callback: (scannedImages: string[]) => void): Promise<void> {
        try {
            if (Platform.OS !== 'web') {
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
            } else {
                // Handle web platform image selection
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png,image/jpeg,image/jpg';
                input.multiple = true;

                input.onchange = (event: Event) => {
                    const files = (event.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                        const imageUris: string[] = [];
                        Array.from(files).forEach(file => {
                            // Verify file type
                            if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                                const uri = URL.createObjectURL(file);
                                imageUris.push(uri);
                            }
                        });

                        if (imageUris.length > 0) {
                            const userDate = userService.getCurrentUser();
                            if (!userDate || !userDate.id) {
                                console.error("User data is missing or incomplete. Cannot create group without a valid user ID.");
                                return;
                            }
                            callback(imageUris);
                        } else {
                            showAlert('Gagal Upload Foto', "No valid images selected. Only PNG, JPG, and JPEG formats are supported.");
                        }
                    }
                };

                input.click();
            }
        } catch (error) {
            console.error("Error scanning document:", error);
        }
    }

    async extractTextFromImage(uri: string) {
        try {
            if (Platform.OS !== 'web') {
                const result: MlkitOcrResult = await MlkitOcr.detectFromUri(uri);
                const text = result.map(block => block.text).join('\n');
                return text;
            } else {
                const { data: { text } } = await Tesseract.recognize(uri, 'ind');
                return text;
            }
        } catch (error) {
            console.error('Error during OCR:', error);
            return undefined;
        }
    }
}

export const scannerService = new ScannerService();