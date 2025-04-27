import DocumentScanner from "react-native-document-scanner-plugin";
import { documentService, groupService, userService } from ".";
import { CreateDocumentData } from "./Document";
import { CreateGroupData } from "./Group";

class ScannerService {
    async scanDocument(callback: (scannedImages: string[]) => void): Promise<void> {
        try {
            const { scannedImages } = await DocumentScanner.scanDocument();
            if (!scannedImages) {
                console.log("No images scanned.");
                return;
            }

            const userDate = userService.getCurrentUser();
            if (!userDate || !userDate.id) {
                console.error("User data is missing or incomplete. Cannot create group without a valid user ID.");
                return;
            }

            // Create new group (fix typo: groudData -> groupData)
            const groupData: CreateGroupData = {
                customerId: '',
                userId: userDate.id,
                createdAt: new Date(),
            };
            const groupResponse = await groupService.createGroup(groupData);
            if (!groupResponse) {
                console.error("Error creating group");
                return;
            }

            // Analyze the document type
            scannedImages.map((image) => {
                const documentType = "-";
                const data: CreateDocumentData = {
                    type: documentType,
                    image_url: image,
                    customerId: groupResponse.id,
                    createdAt: new Date(),
                };
                documentService.addDocument(data);
            });

            if (scannedImages && scannedImages.length > 0) {
                callback(scannedImages);
            }
        } catch (error) {
            console.error("Error scanning document:", error);
        }
    }
}

export const scannerService = new ScannerService();
