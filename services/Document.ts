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
    limit,
    serverTimestamp,
    Timestamp,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    SnapshotOptions,
    DocumentData,
    WithFieldValue,
    DocumentReference
} from 'firebase/firestore';
import { scannerService } from './Scanner';
import useDocumentStore from '@/stores/Document';
import { imagesUriToDocumentMapper } from '@/utils/formatter';
import { router } from 'expo-router';
import firebaseInstance from './Firebase';
import useGroupStore from '@/stores/Group';

// Define document types
export interface Document {
    id?: string;
    groupId: string;
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

    /**
     * Create a new document
     * @param documentData Document data to create
     * @returns Promise with the created document
     */
    public async addDocument(documentData: CreateDocumentData): Promise<Document> {
        try {
            const docData: CreateDocumentData = {
                ...documentData,
                createdAt: documentData.createdAt instanceof Date
                    ? Timestamp.fromDate(documentData.createdAt)
                    : documentData.createdAt
            };

            const collectionRef = collection(this.db, this.collectionName).withConverter(documentConverter);
            const docRef = await addDoc(collectionRef, docData as Document);

            const newDoc = await this.getDocumentById(docRef.id);
            return newDoc;
        } catch (error) {
            throw new Error(`Error adding document: ${error instanceof Error ? error.message : String(error)}`);
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
     * Update document
     * @param documentId Document ID to update
     * @param documentData Data to update
     * @returns Promise with the updated document
     */
    public async updateDocument(documentId: string, documentData: UpdateDocumentData): Promise<Document> {
        try {
            const docRef = doc(this.db, this.collectionName, documentId).withConverter(documentConverter);

            // Prepare update data with server timestamp
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

            // Fetch and return the updated document
            return await this.getDocumentById(documentId);
        } catch (error) {
            throw new Error(`Error updating document: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

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




    /**
     * Get documents by type
     * @param type Document type to filter by
     * @param userId Optional user ID to filter by
     * @returns Promise with array of documents
     */
    public async getDocumentsByType(type: string, userId?: string): Promise<Document[]> {
        try {
            let q;

            if (userId) {
                q = query(
                    collection(this.db, this.collectionName).withConverter(documentConverter),
                    where('type', '==', type),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc')
                );
            } else {
                q = query(
                    collection(this.db, this.collectionName).withConverter(documentConverter),
                    where('type', '==', type),
                    orderBy('createdAt', 'desc')
                );
            }

            const querySnapshot = await getDocs(q);
            const documents: Document[] = [];

            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });

            return documents;
        } catch (error) {
            throw new Error(`Error fetching documents by type: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get document reference
     * @param documentId Document ID to get reference for
     * @returns Document reference
     */
    public getDocumentRef(documentId: string): DocumentReference<Document> {
        return doc(this.db, this.collectionName, documentId).withConverter(documentConverter);
    }

    /**
    * Handle scanning a document
    * @returns void
    */
    public handleScanDocument(): void {
        scannerService.scanDocument((scannedImages) => {
            // callback for save scanned images to state
            console.log("Scanned images:", scannedImages)

            // maps the scanned images to the document type
            const groupId = useGroupStore.getState().selectedGroup.id
            const newDocuments = scannedImages.map((imageUri) => imagesUriToDocumentMapper(groupId, imageUri))

            // save to state
            const documentStore = useDocumentStore.getState()
            documentStore.addDocuments(newDocuments)

            // navigate to edit screen
            router.push("/(subtab)/edit")
        })
    }



}

export default DocumentService;