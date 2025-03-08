import DocumentScanner from "react-native-document-scanner-plugin";

class ScannerService {
    async scanDocument(): Promise<void> {
        try {
            const { scannedImages } = await DocumentScanner.scanDocument();

            if (scannedImages && scannedImages.length > 0) {
                // this.setScannedImages(prevImages => [...prevImages, ...scannedImages]);
            }
        } catch (error) {
            console.error("Error scanning document:", error);
        }
    }
}

export const scannerService = new ScannerService();
