import {
    collection,
    getDocs,
    getDoc,
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
    setDoc
} from 'firebase/firestore';
import firebaseInstance from './Firebase';
import { Document } from './Document';
import { documentService } from '.';
import { cloudinaryService } from './Cloudinary';

// Define group types
export interface Group {
    id: string;
    customerId: string;
    userId: string;
    documentCount: number;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

interface GroupWithDocuments extends Group {
    documents: Document[];
}

// Type for creating a new group
export type CreateGroupData = Omit<Group, 'id' | 'updatedAt'>;

// Type for updating an existing group
export type UpdateGroupData = Partial<Omit<Group, 'id' | 'createdAt'>>;

// Firestore converter for Group type
const groupConverter: FirestoreDataConverter<Group> = {
    toFirestore(group: WithFieldValue<Group>): DocumentData {
        return {
            customerId: group.customerId,
            userId: group.userId,
            documentCount: group.documentCount,
            createdAt: group.createdAt instanceof Date ? Timestamp.fromDate(group.createdAt) : group.createdAt,
            updatedAt: serverTimestamp(),
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot<DocumentData>,
        options?: SnapshotOptions
    ): Group {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            customerId: data.customerId,
            userId: data.userId,
            documentCount: data.documentCount,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }
};

class GroupService {
    private db: ReturnType<typeof firebaseInstance.getFirestoreInstance>;
    private collectionName: string;

    constructor() {
        this.db = firebaseInstance.getFirestoreInstance();
        this.collectionName = 'groups';
    }

    // /**
    //  * Create a new group
    //  * @param groupData Group data to create
    //  * @returns Promise with the created group
    //  */
    // public async createGroup(groupData: CreateGroupData): Promise<Group> {
    //     try {
    //         const docData: CreateGroupData = {
    //             ...groupData,
    //             createdAt: groupData.createdAt instanceof Date
    //                 ? Timestamp.fromDate(groupData.createdAt)
    //                 : groupData.createdAt
    //         };

    //         const collectionRef = collection(this.db, this.collectionName).withConverter(groupConverter);
    //         const docRef = await addDoc(collectionRef, docData as Group);

    //         const newGroup = await this.getGroupById(docRef.id);
    //         return newGroup;
    //     } catch (error) {
    //         throw new Error(`Error creating group: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Get all groups
     * @returns Promise with array of all groups
     */
    public async getAllGroups(): Promise<Group[]> {
        try {
            const collectionRef = collection(this.db, this.collectionName).withConverter(groupConverter);
            const querySnapshot = await getDocs(collectionRef);
            const groups: Group[] = [];

            querySnapshot.forEach((doc) => {
                groups.push(doc.data());
            });

            return groups;
        } catch (error) {
            throw new Error(`Error fetching all groups: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
  * Get all groups excluding specified customer IDs, including their documents
  * @param excludedCustomerIds Array of customer IDs to exclude
  * @param documentService Instance of DocumentService to fetch documents
  * @returns Promise with array of groups, each including their documents
  */
    public async getGroupsExcludingCustomerIdsWithDocuments(
        excludedCustomerIds: string[]
    ): Promise<GroupWithDocuments[]> {
        try {
            // 1. Ambil semua grup dari Firestore tanpa filter not-in
            const q = collection(this.db, this.collectionName).withConverter(groupConverter);
            const querySnapshot = await getDocs(q);
            const allGroups: Group[] = querySnapshot.docs.map(doc => doc.data());

            // 2. Filter grup yang customerId-nya tidak ada dalam excludedCustomerIds
            const filteredGroups = allGroups.filter(
                group => !excludedCustomerIds.includes(group.customerId)
            );

            // 3. Ambil dokumen untuk setiap grup yang difilter
            const documentsPromises = filteredGroups.map(group =>
                documentService.getDocumentsByGroupId(group.id)
            );
            const documentsArrays = await Promise.all(documentsPromises);

            // 4. Gabungkan grup dengan dokumennya
            const groupsWithDocuments: GroupWithDocuments[] = filteredGroups.map((group, index) => ({
                ...group,
                documents: documentsArrays[index]
            }));

            return groupsWithDocuments;
        } catch (error) {
            throw new Error(`Error fetching groups with documents: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Get group by ID
     * @param groupId Group ID to retrieve
     * @returns Promise with the group
     */
    public async getGroupById(groupId: string): Promise<Group> {
        try {
            const docRef = doc(this.db, this.collectionName, groupId).withConverter(groupConverter);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                throw new Error(`Group with ID ${groupId} not found`);
            }
        } catch (error) {
            throw new Error(`Error fetching group: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // /**
    //  * Get all groups for a customer ID
    //  * @param customerId Customer ID to get groups for
    //  * @returns Promise with array of groups
    //  */
    // public async getGroupsByCustomerId(customerId: string): Promise<Group[]> {
    //     try {
    //         const q = query(
    //             collection(this.db, this.collectionName).withConverter(groupConverter),
    //             where('customerId', '==', customerId),
    //         );

    //         const querySnapshot = await getDocs(q);
    //         const groups: Group[] = [];

    //         querySnapshot.forEach((doc) => {
    //             groups.push(doc.data());
    //         });

    //         return groups;
    //     } catch (error) {
    //         throw new Error(`Error fetching groups: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Search groups by customer ID
     * @param customerId Customer ID to search groups for
     * @returns Promise with array of groups
     */
    public async searchGroups(customerId: string): Promise<Group[]> {
        try {
            const q = query(
                collection(this.db, this.collectionName).withConverter(groupConverter),
                where('customerId', '>=', customerId),
                where('customerId', '<=', customerId + '\uf8ff'),
            );

            const querySnapshot = await getDocs(q);
            const groups: Group[] = [];

            querySnapshot.forEach((doc) => {
                groups.push(doc.data());
            });

            return groups;
        } catch (error) {
            throw new Error(`Error searching groups: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
  * Insert or update a group based on group ID existence
  * @param groupId Group ID to check (optional, auto-generated if not provided)
  * @param groupData Data for creating or updating the group
  * @returns Promise with the created or updated group
  */
    public async upsertGroup(groupId: string | undefined, groupData: CreateGroupData | UpdateGroupData): Promise<Group> {
        try {
            // Menentukan referensi dokumen
            const docRef = groupId
                ? doc(this.db, this.collectionName, groupId).withConverter(groupConverter)
                : doc(collection(this.db, this.collectionName)).withConverter(groupConverter);

            // Jika groupId tidak disediakan, gunakan ID dari docRef
            const effectiveGroupId = groupId || docRef.id;

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Group exists, update it
                const updateData: Record<string, any> = {
                    ...groupData,
                    updatedAt: serverTimestamp()
                };

                // Convert Date objects to Firestore Timestamps
                Object.entries(updateData).forEach(([key, value]) => {
                    if (value instanceof Date) {
                        updateData[key] = Timestamp.fromDate(value);
                    }
                });

                await updateDoc(docRef, updateData);
                return await this.getGroupById(effectiveGroupId);
            } else {
                // Group doesn't exist, create new one
                const createData: CreateGroupData = {
                    customerId: (groupData as CreateGroupData).customerId,
                    userId: (groupData as CreateGroupData).userId,
                    documentCount: (groupData as CreateGroupData).documentCount,
                    createdAt: 'createdAt' in groupData && groupData.createdAt
                        ? (groupData.createdAt instanceof Date
                            ? Timestamp.fromDate(groupData.createdAt)
                            : groupData.createdAt)
                        : Timestamp.now()
                };

                await setDoc(docRef, createData);
                return await this.getGroupById(effectiveGroupId);
            }
        } catch (error) {
            throw new Error(`Error inserting or updating group: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // /**
    //  * Update group
    //  * @param groupId Group ID to update
    //  * @param groupData Data to update
    //  * @returns Promise with the updated group
    //  */
    // public async updateGroup(groupId: string, groupData: UpdateGroupData): Promise<Group> {
    //     try {
    //         const docRef = doc(this.db, this.collectionName, groupId).withConverter(groupConverter);

    //         // Prepare update data with server timestamp
    //         const updateData: Record<string, any> = {
    //             ...groupData,
    //             updatedAt: serverTimestamp()
    //         };

    //         // Convert Date objects to Firestore Timestamps
    //         Object.entries(updateData).forEach(([key, value]) => {
    //             if (value instanceof Date) {
    //                 updateData[key] = Timestamp.fromDate(value);
    //             }
    //         });

    //         await updateDoc(docRef, updateData);

    //         // Fetch and return the updated group
    //         return await this.getGroupById(groupId);
    //     } catch (error) {
    //         throw new Error(`Error updating group: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Delete group
     * @param groupId Group ID to delete
     * @returns Promise with boolean indicating success
     */
    public async deleteGroup(groupId: string): Promise<boolean> {
        try {
            // Delete the group document
            await deleteDoc(doc(this.db, this.collectionName, groupId));
            return true;
        } catch (error) {
            throw new Error(`Error deleting group: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Delete all groups
     * @returns Promise with boolean indicating success
     */
    public async deleteAllGroups(): Promise<boolean> {
        try {
            // Delete all documents in Cloudinary in parallel
            const docs = await documentService.getAllDocuments();
            const cloudinaryDeletePromises = docs
                .filter(doc => doc.image_public_id)
                .filter(doc => doc.image_public_id !== undefined)
                .map(doc => cloudinaryService.deleteFile(doc.image_public_id as string));
            await Promise.all(cloudinaryDeletePromises);

            // Delete all group documents in parallel
            const collectionRef = collection(this.db, this.collectionName).withConverter(groupConverter);
            const querySnapshot = await getDocs(collectionRef);
            const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            return true;
        } catch (error) {
            throw new Error(`Error deleting all groups: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // /**
    //  * Get groups by type
    //  * @param type Group type to filter by
    //  * @param customerId Optional customer ID to filter by
    //  * @returns Promise with array of groups
    //  */
    // public async getGroupsByType(type: string, customerId?: string): Promise<Group[]> {
    //     try {
    //         let q;

    //         if (customerId) {
    //             q = query(
    //                 collection(this.db, this.collectionName).withConverter(groupConverter),
    //                 where('type', '==', type),
    //                 where('customerId', '==', customerId),
    //                 orderBy('createdAt', 'desc')
    //             );
    //         } else {
    //             q = query(
    //                 collection(this.db, this.collectionName).withConverter(groupConverter),
    //                 where('type', '==', type),
    //                 orderBy('createdAt', 'desc')
    //             );
    //         }

    //         const querySnapshot = await getDocs(q);
    //         const groups: Group[] = [];

    //         querySnapshot.forEach((doc) => {
    //             groups.push(doc.data());
    //         });

    //         return groups;
    //     } catch (error) {
    //         throw new Error(`Error fetching groups by type: ${error instanceof Error ? error.message : String(error)}`);
    //     }
    // }

    /**
     * Get groups created by a specific user
     * @param userId User ID who created the groups
     * @returns Promise with array of groups
     */
    public async getGroupsByCreator(userId: string): Promise<Group[]> {
        try {
            const q = query(
                collection(this.db, this.collectionName).withConverter(groupConverter),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const groups: Group[] = [];


            querySnapshot.forEach((doc) => {
                groups.push(doc.data());
            });

            return groups;
        } catch (error) {
            console.error(`Error fetching groups by creator: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Error fetching groups by creator: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // /**
    //  * Get group reference
    //  * @param groupId Group ID to get reference for
    //  * @returns Group reference
    //  */
    // public getGroupRef(groupId: string): DocumentReference<Group> {
    //     return doc(this.db, this.collectionName, groupId).withConverter(groupConverter);
    // }
}

export default GroupService;