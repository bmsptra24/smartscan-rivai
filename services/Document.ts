import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    DocumentData,
    WithFieldValue,
    DocumentReference,
    setDoc
} from 'firebase/firestore';
import { scannerService } from './Scanner';
import useDocumentStore from '@/stores/Document';
import { imagesUriToDocumentMapper } from '@/utils/formatter';
import { router } from 'expo-router';
import firebaseInstance from './Firebase';
import useGroupStore from '@/stores/Group';
import { generateID } from '@/utils/generator';
import { Group } from './Group';
import { userService } from '.';
import { detectCustomerId, detectDocumentType } from '@/utils/analizeDocument';

// Define document types
export interface Document {
    id?: string;
    groupId: string;
    image_public_id?: string;
    image_url: string;
    type: string;
    createdAt: Date | Timestamp;
    updatedAt?: Date | Timestamp;
}

// Type for creating a new document
export type CreateDocumentData = Omit<Document, 'id' | 'updatedAt'>;

// Type for updating an existing document
export type UpdateDocumentData = Partial<Omit<Document, 'id' | 'createdAt'>>;

// Firestore converter for Document type
const documentConverter: FirestoreDataConverter<Document> = {
    toFirestore(document: WithFieldValue<Document>): DocumentData {
        return {
            groupId: document.groupId,
            image_public_id: document.image_public_id,
            image_url: document.image_url,
            type: document.type,
            createdAt: document.createdAt instanceof Date ? Timestamp.fromDate(document.createdAt) : document.createdAt,
            updatedAt: serverTimestamp(),
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options?: SnapshotOptions
    ): Document {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            groupId: data.groupId,
            image_public_id: data.image_public_id,
            image_url: data.image_url,
            type: data.type,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
};

class DocumentService {
    private db: ReturnType<typeof firebaseInstance.getFirestoreInstance>;
    private collectionName: string;

    constructor() {
        this.db = firebaseInstance.getFirestoreInstance();
        this.collectionName = 'documents';
    }

    // /**
    //  * Create a new document
    //  * @param documentData Document data to create
    //  * @returns Promise with the created document
    //  */
    // public async addDocument(documentData: CreateDocumentData): Promise<Document> {
    //     try {
    //         const docData: CreateDocumentData = {
    //             ...documentData,
    //             createdAt: documentData.createdAt instanceof Date
    //                 ? Timestamp.fromDate(documentData.createdAt)
    //                 : documentData.createdAt
    //         };

    //         const collectionRef = collection(this.db, this.collectionName).withConverter(documentConverter);
    //         const docRef = await addDoc(collectionRef, docData as Document);

    //         const newDoc = await this.getDocumentById(docRef.id);
    //         return newDoc;
    //     } catch (error) {
    //         throw new Error(`Error adding document: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Get all documents
     * @returns Promise with array of all documents
     */
    public async getAllDocuments(): Promise<Document[]> {
        try {
            const collectionRef = collection(this.db, this.collectionName).withConverter(documentConverter);
            const querySnapshot = await getDocs(collectionRef);
            const documents: Document[] = [];

            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });

            return documents;
        } catch (error) {
            throw new Error(`Error fetching all documents: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get document by ID
     * @param documentId Document ID to retrieve
     * @returns Promise with the document
     */
    public async getDocumentById(documentId: string): Promise<Document> {
        try {
            const docRef = doc(this.db, this.collectionName, documentId).withConverter(documentConverter);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                throw new Error(`Document with ID ${documentId} not found`);
            }
        } catch (error) {
            throw new Error(`Error fetching document: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
    * Insert or update a document based on document ID existence
    * @param documentId Document ID to check
    * @param documentData Data for creating or updating the document
    * @returns Promise with the created or updated document
    */
    public async upsertDocument(documentId: string, documentData: CreateDocumentData | UpdateDocumentData): Promise<Document> {
        try {
            const docRef = doc(this.db, this.collectionName, documentId).withConverter(documentConverter);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Document exists, update it
                const updateData: Record<string, any> = {
                    ...documentData,
                    updatedAt: serverTimestamp()
                };

                // Convert Date objects to Firestore Timestamps
                Object.entries(updateData).forEach(([key, value]) => {
                    if (value instanceof Date) {
                        updateData[key] = Timestamp.fromDate(value);
                    }
                });

                await updateDoc(docRef, updateData);
                return await this.getDocumentById(documentId);
            } else {
                // Document doesn't exist, create new one
                const createData: CreateDocumentData = {
                    groupId: (documentData as CreateDocumentData).groupId,
                    image_public_id: (documentData as CreateDocumentData).image_public_id,
                    image_url: (documentData as CreateDocumentData).image_url,
                    type: (documentData as CreateDocumentData).type,
                    createdAt: 'createdAt' in documentData && documentData.createdAt
                        ? (documentData.createdAt instanceof Date
                            ? Timestamp.fromDate(documentData.createdAt)
                            : documentData.createdAt)
                        : Timestamp.now()
                };

                await setDoc(docRef, createData);
                return await this.getDocumentById(documentId);
            }
        } catch (error) {
            throw new Error(`Error inserting or updating document: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Update document
     * @param documentId Document ID to update
     * @param documentData Data to update
     * @returns Promise with the updated document
     */
    // public async updateDocument(documentId: string, documentData: UpdateDocumentData): Promise<Document> {
    //     try {
    //         const docRef = doc(this.db, this.collectionName, documentId).withConverter(documentConverter);

    //         // Prepare update data with server timestamp
    //         const updateData: Record<string, any> = {
    //             ...documentData,
    //             updatedAt: serverTimestamp()
    //         };

    //         // Convert Date objects to Firestore Timestamps
    //         Object.entries(updateData).forEach(([key, value]) => {
    //             if (value instanceof Date) {
    //                 updateData[key] = Timestamp.fromDate(value);
    //             }
    //         });

    //         await updateDoc(docRef, updateData);

    //         // Fetch and return the updated document
    //         return await this.getDocumentById(documentId);
    //     } catch (error) {
    //         throw new Error(`Error updating document: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Delete document
     * @param documentId Document ID to delete
     * @returns Promise with boolean indicating success
     */
    public async deleteDocument(documentId: string): Promise<boolean> {
        try {
            const docRef = doc(this.db, this.collectionName, documentId);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            throw new Error(`Error deleting document: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
 * Delete all documents by group ID
 * @param groupId Group ID of documents to delete
 * @returns Promise with boolean indicating success
 */
    public async deleteDocumentsByGroupId(groupId: string): Promise<boolean> {
        try {
            // Query all documents with the specified groupId
            const q = query(
                collection(this.db, this.collectionName).withConverter(documentConverter),
                where('groupId', '==', groupId)
            );

            const querySnapshot = await getDocs(q);

            // Create an array of delete promises
            const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
            });

            // Execute all delete operations
            await Promise.all(deletePromises);

            return true;
        } catch (error) {
            throw new Error(`Error deleting documents by groupId: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Delete all documents
     * @returns Promise with boolean indicating success
     */
    public async deleteAllDocuments(): Promise<boolean> {
        try {
            const collectionRef = collection(this.db, this.collectionName).withConverter(documentConverter);
            const querySnapshot = await getDocs(collectionRef);

            // Create an array of delete promises
            const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
            });

            // Execute all delete operations
            await Promise.all(deletePromises);

            return true;
        } catch (error) {
            throw new Error(`Error deleting all documents: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Search documents by group ID
     * @param groupId Group ID to search for
     * @returns Promise with array of matching documents
     */
    public async getDocumentsByGroupId(groupId: string): Promise<Document[]> {
        try {
            const q = query(
                collection(this.db, this.collectionName).withConverter(documentConverter),
                where('groupId', '==', groupId),
                // orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const documents: Document[] = [];

            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });

            return documents;
        } catch (error) {
            throw new Error(`Error searching documents: ${error instanceof Error ? error.message : String(error)}`);
        }
    }




    // /**
    //  * Get documents by type
    //  * @param type Document type to filter by
    //  * @param userId Optional user ID to filter by
    //  * @returns Promise with array of documents
    //  */
    // public async getDocumentsByType(type: string, userId?: string): Promise<Document[]> {
    //     try {
    //         let q;

    //         if (userId) {
    //             q = query(
    //                 collection(this.db, this.collectionName).withConverter(documentConverter),
    //                 where('type', '==', type),
    //                 where('userId', '==', userId),
    //                 orderBy('createdAt', 'desc')
    //             );
    //         } else {
    //             q = query(
    //                 collection(this.db, this.collectionName).withConverter(documentConverter),
    //                 where('type', '==', type),
    //                 orderBy('createdAt', 'desc')
    //             );
    //         }

    //         const querySnapshot = await getDocs(q);
    //         const documents: Document[] = [];

    //         querySnapshot.forEach((doc) => {
    //             documents.push(doc.data());
    //         });

    //         return documents;
    //     } catch (error) {
    //         throw new Error(`Error fetching documents by type: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    // /**
    //  * Get document reference
    //  * @param documentId Document ID to get reference for
    //  * @returns Document reference
    //  */
    // public getDocumentRef(documentId: string): DocumentReference<Document> {
    //     return doc(this.db, this.collectionName, documentId).withConverter(documentConverter);
    // }

    /**
    * Handle scanning a document
    * @returns void
    */
    public handleScanDocument(): void {
        scannerService.scanDocument((scannedImages) => {
            const documentStore = useDocumentStore.getState()
            let groupId = useGroupStore.getState().selectedGroup?.id

            // if group does not selected, create new group with raw data, so in edit page they can use selected data to referece to the document taht we want to edit
            if (!groupId) {
                groupId = generateID('groups')
                const userId = userService.getCurrentUser()?.id
                if (!userId) return console.error("User not found");

                const rawGroup: Group = {
                    userId,
                    id: groupId,
                    customerId: "",
                    createdAt: Timestamp.now(),
                    documentCount: 0,
                };
                useGroupStore.getState().setSelectedGroup(rawGroup)
            }
            const newDocuments = scannedImages.map((imageUri) => imagesUriToDocumentMapper(groupId, imageUri))

            // Analize the document type
            newDocuments.forEach(async (doc) => {
                // Mulai pengukuran waktu
                const startTime = Date.now();

                // OCR the image
                let type, idpel;
                const ocrResult = await scannerService.extractTextFromImage(doc.image_url);

                // Analize the text
                if (!ocrResult) type = "Lainnya";
                if (ocrResult) type = detectDocumentType(ocrResult);
                if (ocrResult) idpel = detectCustomerId(ocrResult);

                // Akhiri pengukuran waktu dan hitung durasi
                const endTime = Date.now();
                const duration = endTime - startTime;
                console.log(`Waktu pemrosesan untuk dokumen ${doc.id}: ${duration} ms`);

                if (!doc.id) return

                if (type) {
                    documentStore.updateDocumentCategory(doc.id, type);
                }

                if (idpel) {
                    useGroupStore.getState().updateSelectedGroupCustomerId(idpel);
                }
            });

            // documentStore.updateCustomerId(doc.id, idPelanggan)

            // save to state
            documentStore.addDocuments(newDocuments)

            // navigate to edit screen
            router.push("/(subtab)/edit")
        })
    }
}

export default DocumentService;