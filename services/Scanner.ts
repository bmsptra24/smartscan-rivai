import DocumentScanner from "react-native-document-scanner-plugin";
import { documentService, groupService, userService } from ".";
import { CreateDocumentData } from "./Document";
import { CreateGroupData } from "./Group";
import { Timestamp } from "firebase/firestore";

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
}

export const scannerService = new ScannerService();
